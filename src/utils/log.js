export function timedLog(msg, opt, ms) {
  setTimeout(() => {
    console.log(msg, opt);
  }, ms);
}
