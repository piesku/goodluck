export type Model = Float32Array;

export function load(path: string): Promise<Array<Model>> {
    return fetch(path)
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
            let buffer_array = new Uint16Array(buffer);
            let model_data: Array<Model> = [];
            let i = 0;

            while (i < buffer_array.length) {
                let size: number[] = [0, 0, 0];
                let model_start = i + 1;
                let model_length = buffer_array[i];
                let model_end = model_start + model_length;
                let model = [];

                for (i = model_start; i < model_end; i++) {
                    let voxel = buffer_array[i];
                    model.push(
                        (voxel & 15) >> 0,
                        (voxel & 240) >> 4,
                        (voxel & 3840) >> 8,
                        (voxel & 61440) >> 12
                    );
                }

                for (let j = 0; j < model.length; j++) {
                    if (size[j % 4] < model[j] + 1) {
                        size[j % 4] = model[j] + 1;
                    }
                }

                model_data.push(
                    new Float32Array(model).map((val, idx) => {
                        switch (idx % 4) {
                            case 0:
                                return val - size[0] / 2 + 0.5;
                            case 1:
                                return val - size[1] / 2 + 0.5;
                            case 2:
                                return val - size[2] / 2 + 0.5;
                            default:
                                return val;
                        }
                    })
                );
            }

            return model_data;
        });
}
