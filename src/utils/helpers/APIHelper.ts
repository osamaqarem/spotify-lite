import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { ErrorResponse } from "../../data/models/spotify";

const handleResponse = (res: Response) => {
  const isJSON = res.headers.get("Content-Type")?.includes("application/json");

  if (res.ok) {
    // HTTP 2XX
    return isJSON ? res.json() : res.text();
  } else {
    // Not 2XX, but is JSON
    if (isJSON) {
      return res.json();
    }

    // Not 2XX, but not JSON.
    throw new Error(res.status.toString());
  }
};

const handleType = <T>(res: ErrorResponse | string | T) => {
  if (typeof res === "string") {
    throw new Error("Did not get JSON:\n" + res);
  }

  if ("error" in res) {
    throw new Error(res.error.status + ": " + res.error.message);
  }

  return res;
};

const handleCommonResponse = <T>() => (input: Observable<Response>) =>
  input.pipe(
    switchMap(res => handleResponse(res)),
    map(res => handleType<T>(res)),
  );

const APIHelper = { handleResponse, handleType, handleCommonResponse };

export default APIHelper;
