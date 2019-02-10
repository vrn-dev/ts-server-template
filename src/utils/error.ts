export function errorPropsBuilder(ref: string | null, trace: ErrTraceProps, originalError: string = null) {
  return {
    ref,
    trace,
    originalError,
  };
}

export function errorDetails() {
  const e = new Error();
  const regex = /\((.*):(\d+):(\d+)\)$/;
  const match = regex.exec(e.stack.split('\n')[2]);
  const fp = match[1].split('/').reverse();
  const filepath = `/${fp[1]}/${fp[0]}`;
  return {
    filepath,
    line: match[2],
    column: match[3],
  };
}

interface ErrTraceProps {
  filepath: string;
  line: string;
  column: string;
}
