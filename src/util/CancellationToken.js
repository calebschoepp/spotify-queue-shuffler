// Original inspiration
// https://stackoverflow.com/questions/37624144/is-there-a-way-to-short-circuit-async-await-flow

// Alternative implementation idea
// https://ckeditor.com/blog/Aborting-a-signal-how-to-cancel-an-asynchronous-task-in-JavaScript/

class CancellationToken {
  constructor() {
    this.isCancellationRequested = false;
  }

  cancel() {
    this.isCancellationRequested = true;
  }

  reset() {
    this.isCancellationRequested = false;
  }
}

export default CancellationToken;
