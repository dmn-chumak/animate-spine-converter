export class LayerMaskUtil {
    public static extractTargetMask(layers:FlashLayer[], targetIdx:number):FlashLayer {
        for (let layerIdx = targetIdx - 1; layerIdx >= 0; layerIdx--) {
            const layer = layers[layerIdx];

            if (layer.layerType === 'mask') {
                return layer;
            }
        }

        return null;
    }
}
