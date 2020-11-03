export function throwIfBulkWriteResultInvalid(bWriteResult, expectedModCount = 1) {
  if (bWriteResult.modifiedCount !== expectedModCount) {
    throw new Error(
      'Make sure, you run these tests with the jest option "--runInBand". (prevents tests running in parallel)! ModificationCount is ' +
        bWriteResult.modifiedCount
    );
  }
}
