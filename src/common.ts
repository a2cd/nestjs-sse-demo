import { Subject } from 'rxjs';

export class SubjectUtil {
  public static m: Map<string, Subject<any>> = new Map<string, Subject<any>>();
}
