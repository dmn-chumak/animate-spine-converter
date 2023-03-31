async function createSpinePlayer(container, path, delay) {
    const application = new PIXI.Application({ backgroundColor: 0xFFFFFF, width: 300, height: 300 });
    document.getElementById(container).appendChild(application.view);

    const resource = await PIXI.Assets.load(path);
    const labels = resource.spineData.animations.map((animation) => animation.name);
    const object = new PIXI.spine.Spine(resource.spineData);
    let index = 0;

    object.x = application.screen.width / 2;
    object.y = application.screen.height / 2;
    application.stage.addChild(object);

    const nextAnimation = () => {
        const track = object.state.setAnimation(0, labels[index]);
        index = (index + 1) % labels.length;

        track.listener = {
            complete: () => {
                setTimeout(nextAnimation, delay);
                track.listener = null;
            }
        };
    };

    return {
        play: nextAnimation
    };
}

async function createFlashPlayer(container, path) {
    const player = window.RufflePlayer.newest().createPlayer();
    document.getElementById(container).appendChild(player);
    await player.load(path);

    return player;
}

function createRuffleConfig() {
    window.RufflePlayer.config = {
        unmuteOverlay: 'hidden',
        warnOnUnsupportedContent: false,
        contextMenu: false,
        autoplay: 'off',
        splashScreen: false,
        menu: false
    };
}
