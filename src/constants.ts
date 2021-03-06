import { resolveS3Path } from './utils';

export abstract class PhysicsConstants {
  static readonly gravity: [number, number, number] = [0, -30, 0];

  static readonly pointLight: [number, number, number] = [10, 10, 10];
}

export abstract class MathConstants {
  static readonly roundingPrecision = 3;
}

export abstract class Plants {
  static readonly smallBluePlantPath: string = resolveS3Path(
    'smallBluePlant/scene.gltf',
    'model',
  );

  static readonly mushroomTreePath: string = resolveS3Path(
    'mushroomTree/scene.gltf',
    'model',
  );

  static readonly smallBluePlantPotPath: string = resolveS3Path(
    'smallBluePlantPot/scene.gltf',
    'model',
  );
}

export abstract class Objects {
  static readonly gunshipPath: string = resolveS3Path(
    'gunship/scene.gltf',
    'model',
  );
}

export abstract class Colors {
  static readonly black = '#000000';

  static readonly grey = '#808080';

  static readonly green = '#008000';

  static readonly debugYellow = '#FFD702';

  static readonly white = '##FFFFFF';

  static readonly dialogBlue = '#8BD9FF';

  static readonly warningRed = '#ed4650';

  static readonly bgGrey = 'rgb(220, 220, 220, 0.5)';
}

export abstract class Dims {
  static readonly floorX = 100;

  static readonly floorZ = 100;
}

export abstract class Mass {
  static readonly heavyObject = 10;
}

export abstract class Boundary {
  static readonly visiblePlaneHeight = 10;
}

export abstract class SkyboxImages {
  static readonly negz: string = resolveS3Path('negz.jpg', 'texture');

  static readonly posz: string = resolveS3Path('posz.jpg', 'texture');

  static readonly posy: string = resolveS3Path('posy.jpg', 'texture');

  static readonly negy: string = resolveS3Path('negy.jpg', 'texture');

  static readonly posx: string = resolveS3Path('posx.jpg', 'texture');

  static readonly negx: string = resolveS3Path('negx.jpg', 'texture');
}

export abstract class PlayerConstants {
  static readonly speed = 10;

  static readonly jumpVelocity = 15;

  static readonly mass = 15;
}

export abstract class DisplayConstants {
  static readonly VideoPlayerHeight = 112;

  static readonly VideoPlayerWidth = 149;

  static readonly mass = 15;
}
