import { task, watch, src, dest } from 'gulp';


/**
 * Creates a set of gulp tasks that can build the specified package.
 * @param packageName Name of the package.
 *        Needs to be similar to the directory name in `src/`.
 * @param requiredPackages Required packages that will be built
 *        before building the current package.
 */
export function createPackageBuildTasks(
  a_s_package_name: string,
  a_ay_s_required_packages: string[] = [])
  : void
{


} // createPackageBuildTasks()