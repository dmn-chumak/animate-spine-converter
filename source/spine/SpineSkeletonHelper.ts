import { SpineBone } from './SpineBone';
import { SpineSkeleton } from './SpineSkeleton';

export class SpineSkeletonHelper {
    public static simplifySkeletonNames(skeleton:SpineSkeleton):void {
        while (true) {
            let hasCollisions = false;
            let isSimplified = true;

            //-----------------------------------

            const bones:SpineBone[] = [];
            const repeats:Record<string, number> = {};
            const names:string[] = [];

            //-----------------------------------

            for (const bone of skeleton.bones) {
                const path = bone.name.split('/');
                let name = bone.name;

                if (path.length > 1) {
                    name = path.slice(1).join('/');
                    isSimplified = false;
                }

                if (repeats[name] == null) {
                    repeats[name] = 1;
                } else {
                    repeats[name]++;
                }

                names.push(name);
                bones.push(bone);
            }

            //-----------------------------------

            for (let index = 0; index < bones.length; index++) {
                const name = names[index];

                if (repeats[name] === 1) {
                    bones[index].name = name;
                } else {
                    hasCollisions = true;
                }
            }

            //-----------------------------------

            if (hasCollisions || isSimplified) {
                break;
            }
        }
    }
}
