import {useEffect} from "react";

export function useHotKey (props) {
  const {
    cb,
    ref,
    key
  } = props;

  const handleOnKeyDown = (e) => {
    console.log(e.key, key, e.key === key, cb);
    if (e.key === key && cb) {
      cb();
    }
  }

  useEffect(() => {
    ref.current.addEventListener("keydown", handleOnKeyDown);

    return () => {
      ref.current.removeEventListener("keydown", handleOnKeyDown);
    }
  }, [])
}
