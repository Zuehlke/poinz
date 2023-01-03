import {spawn} from 'cross-spawn';

/**
 * spawns a child process (nodejs' child_process.spawn)
 * and pipes stdout and stderr to the node process.
 *
 * @param command
 * @param args
 * @param options
 * @returns {Promise<T>} Returns a promise that will reject if childprocess does not exit with code 0.
 */
export function spawnAndPrint(command, args, options) {
  const spawned = spawn(command, args, options);
  spawned.stdout.pipe(process.stdout);
  spawned.stderr.pipe(process.stderr);

  return new Promise((resolve, reject) =>
    spawned.on('exit', (code) =>
      code !== 0
        ? reject(
            new Error(
              ` Error in child process: ${code} - was trying to run "${command}"  with args "${args}" and options "${JSON.stringify(
                options
              )}"`
            )
          )
        : resolve()
    )
  );
}
