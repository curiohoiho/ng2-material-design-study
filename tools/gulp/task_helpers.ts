import * as child_process from 'child_process';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as gulpTs from 'gulp-typescript';
import * as path from 'path';

import { NPM_VENDOR_FILES, PROJECT_ROOT, DIST_ROOT, SASS_AUTOPREFIXER_OPTIONS } from './constants';


/** These imports lack typings. */
const gulpClean = require('gulp-clean');
const gulpMerge = require('merge2');
const gulpRunSequence = require('run-sequence');
const gulpSass = require('gulp-sass');
const gulpServer = require('gulp-server-livereload');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpAutoprefixer = require('gulp-autoprefixer');
const resolveBin = require('resolve-bin');


/**
 * if the string passed in is a glob, return it;
 * otherwise, append '**\/*' to it 
 */
function _globify(maybeGlob: string, suffix = '**/*') : string
{
  if (maybeGlob.indexOf('*') != -1) 
  {
    return maybeGlob;
  }

  try {
    const stat = fs.stateSync(maybeGlob);
    if (stat.isFile()) 
    {
      return maybeGlob;
    }
  } 
  catch (e) {}

  return path.join(maybeGlob, suffix);

} // _globify()


/**  create a ts build task, based on the options */
export function tsBuildTask(tsConfigPath: string, tsConfigName = 'tsconfig.json')
{
  let tsConfigDir = tsConfigPath;
  if (fs.existsSync(path.join(tsConfigDir, tsConfigName)))
  {
    // append tsconfig.json
    tsConfigPath = path.join(tsConfigDir, tsConfigName);
  }
  else
  {
    tsConfigDir = path.dirname(tsConfigDir);
  }

  return () => {
    const tsConfig: any = JSON.parse(fs.readFileSync(tsConfigPath, 'utf-8'));
    const dest: string = path.join(tsConfigDir, tsConfig['compilerOptions']['outDir']);

    const tsProject = gulpTs.createProject(tsConfigPath, {
      typescript: require('typescript')
    });

    let pipe = tsProject.src()
      .pipe(gulpSourcemaps.init())
      .pipe(gulpTs(tsProject));
    let dts = pipe.dts.pipe(gulp.dest(dest));

    return gulpMerge([
      dts,
      pipe
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulp.dest(dest))
    ]);
  }; // return ()

} // tsBuildTask()


/** create a sass build task */ 
export function sassBuildTask(dest: string, root: string, includePaths: string[]) : () => any 
{
  const sassOptions = { includePaths };

  // return a function; which, when called, runs the gulp-sass pipeline 
  return () => {
    return gulp.src(_globify(root, '**/*.scss'))
      .pipe(gulpSourcemaps.init())
      .pipe(gulpSass(sassOptions).on('error', gulpSass.logError))
      .pipe(gulpAutoprefixer(SASS_AUTOPREFIXER_OPTIONS))
      .pipe(gulpSourcemaps.write('.'))
      .pipe(gulp.dest(dest));
  }; // return 

} // sassBuiltTask()


/** options that can be passed to execTask or execNodeTask */
export interface ExecTaskOptions
{
  // whether to output to STDERR and STDOUT
  silent?: boolean;

  // if an error happens, this will replace the standard error
  errMessage?: string;
}


/** create a task that executes a binary as if from the command line */
export function execTask(
  binPath: string,
  args: string[],
  options: ExecTaskOptions = {})
{
  // return a function, which itself expects an argument that is a function 
  return ( done: (err?: string) => void ) => {
    const childProcess = child_process.spawn(binPath, args);

    if (!options.silent)
    {
      childProcess.stdout.on('data', (data: string) => {
        process.stdout.write(data);
      });
      
      childProcess.stderr.on('data', (data: string) => {
        process.stderr.write(data);
      });
    } // if

    // create callback for 'close'
    childProcess.on('close', (code: number) => {
      if (code != 0)
      {
        if (options.errMessage === undefined)
        {
          done('Process failed with code ' + code);
        }
        else 
        {
          done(options.errMessage);
        }
      }
      else // if code == 0
      {
        done();
      } // outer if..else
      
    }); // childProcess.on('close')

  }; // return 

} // execTask()


/**
 * Create a task that executes an NPM Bin, by resolving the binary path then executing it. These are
 * binaries that are normally in the `./node_modules/.bin` directory, but their name might differ
 * from the package. Examples are typescript, ngc and gulp itself.
 */
export function execNodeTask(
  packageName: string,
  executable: string | string[],
  args?: string[],
  options: ExecTaskOptions = {}) 
{
  if (!args)
  {
    args = <string[]>executable;
    executable = undefined;
  }

  return (done: (err: any) => void ) => {
    resolveBin(packageName, { executable: executable }, (err: any, binPath: string) => {
      if (err)
      {
        done(err);
      }
      else 
      {
        // execute the node binary within a new child process using spawn.
        // the binary needs to be 'node' because on windows the shell cannot determine the correct
        // interpreter from the shebang
        execTask(binPath, args, options)(done);
      }
    }); // resolveBin()
  }; // return a function, whose argument "done" is a function  

} // execNodeTask()


/** Copy files from a glob to a destination. */
export function copyTask(
  srcGlobOrDir: string | string[],
  outRoot: string) 
  : () => NodeJS.ReadWriteStream
{
  if (typeof srcGlobOrDir === 'string')
  {
    return () => gulp.src(_globify(srcGlobOrDir)).pipe(gulp.dest(outRoot));
  }
  else
  {
    return () => gulp.src(srcGlobOrDir.map(name => _globify(name))).pipe(gulp.dest(outRoot));
  }

} // copyTask()


/** Delete files. */
export function cleanTask(glob: string): () => any 
{
  return () => gulp.src(glob, {read: false}).pipe(gulpClean(null));

} // cleanTask()


/** build a task that depends on all application build tasks */
export function buildAppTask(appName: string) : (done: () => void ) => any
{
  const buildTasks = ['vendor', 'ts', 'scss', 'assets']
    .map(taskName => `:build:${appName}:${taskName}`);
  
  return (done: () => void ) => {
    gulpRunSequence(
      'clean',
      ['build:components', ...buildTasks],
      done
    );
  }; // return a function that expects a function as an argument 

} // buildAppTask()


/** create a task that copies vendor files in the proper destination */
export function vendorTask() : () => NodeJS.ReadWriteStream 
{
  return () => gulpMerge(
    NPM_VENDOR_FILES.map( root => {
      const glob = path.join(PROJECT_ROOT, 'node_modules', root, '**/*.+(js|js.map)');
      return gulp.src(glob).pipe(gulp.dest(path.join(DIST_ROOT, 'vendor', root)));
    }) // map 
  ); // return 

} // vendorTask()


/** create a task that serves the dist folder. */
export function serverTask(
  liveReload: boolean = true,
  streamCallback: (stream: NodeJS.ReadWriteStream) => void = null)
  : () => any 
{
  return () => {
    const stream = gulp.src('dist').pipe(gulpServer({
      livereload: liveReload,
      fallback: 'index.html',
      port: 4200
    }));

    if (streamCallback)
    {
      streamCallback(stream);
    }

    return stream;
  }; // return function 

} // serverTask()


/** create a task that's a sequence of other tasks */
export function sequenceTask(...args: any[]) : (done: any) => any  
{
  return (done: any) => {
    gulpRunSequence(
      ...args,
      done
    );
  }; // return a function 

} // sequenceTask()
