export function throwIfBulkWriteResultInvalid(bWriteResult, expectedModCount = 1) {
  if (bWriteResult.modifiedCount !== expectedModCount) {
    throw new Error(
      'do not run migration tests simultaneously! ModificationCount is ' +
        bWriteResult.modifiedCount
    );
  }
}
