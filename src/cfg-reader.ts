import { Subject } from 'rxjs';

export class SubjectManager {
  public static m: Map<string, Subject<any>> = new Map<string, Subject<any>>();
}
