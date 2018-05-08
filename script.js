var player = {};

// Create new variable
player.elements = {};
player.elements.content =                  document.querySelector('.content');
player.elements.player =                   document.querySelector('.player');
player.elements.video =                    player.elements.content.querySelector('video');
player.elements.panel =                    player.elements.content.querySelector('.panel');
player.elements.button_play_pause =        player.elements.content.querySelector('.button-play-pause');
player.elements.button_play_pause.play =   player.elements.button_play_pause.querySelector('.play')
player.elements.button_play_pause.pause =  player.elements.button_play_pause.querySelector('.pause')
player.elements.progress_bar =             player.elements.content.querySelector('.progress-bar');
player.elements.progress_bar.progress =    player.elements.content.querySelector('.progress');
player.elements.timer_box =                player.elements.content.querySelector('.timer-box');
player.elements.timer =                    player.elements.content.querySelector('.timer');
player.elements.sound =                    player.elements.content.querySelector('.sound');
player.elements.sound.sound_progress =     player.elements.content.querySelector('.sound-progress');
player.elements.HD_quality =               player.elements.content.querySelector('.HD-quality')
player.elements.box_quality =              player.elements.content.querySelector('.box-quality');
player.elements.box_quality.low =          player.elements.content.querySelector('.low');
player.elements.box_quality.hight =        player.elements.content.querySelector('.hight');
player.elements.full_screen_button =       player.elements.content.querySelector('.full-screen-button')

// Inatialation
player.elements.video.addEventListener('loadedmetadata', function () {
    var temps = player.elements.video.duration;
    var m = Math.floor(temps / 59);
    var s = Math.floor(temps % 59)
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }

    // Initialisation timer
    player.elements.timer.innerHTML = m + ':' + s;

    // Initialisation sound
    player.elements.video.volume = 0.7;
    var init_sound = player.elements.video.volume * 100 - 100;
    player.elements.sound.sound_progress.style.transform = 'translateX(' + init_sound + '%)';

    // Initialisation HD
    player.elements.box_quality.classList.add('invisible');

});

// Activation pause-play
player.elements.button_play_pause.addEventListener('click', function (e) {

    if (player.elements.video.paused) {
        player.elements.video.play();
        player.elements.button_play_pause.play.classList.add('invisible');
        player.elements.button_play_pause.pause.classList.remove('invisible');
    } else {
        player.elements.video.pause();
        player.elements.button_play_pause.pause.classList.add('invisible');
        player.elements.button_play_pause.play.classList.remove('invisible');
    }

    e.preventDefault();
});

// Progress elements
window.setInterval(function (e) {
    var ratio = player.elements.video.currentTime / player.elements.video.duration,
        percent = ratio * 100,
        translation = percent - 100,
        rect = player.elements.progress_bar.getBoundingClientRect(),
        timerTranslation = rect.width * ratio;

    // progress
    player.elements.progress_bar.progress.style.transform = 'translateX(' + translation + '%)';
    // timer
    player.elements.timer_box.style.transform = 'translateX(' + timerTranslation + 'px)';

}, 50);

// Progress_bar click
var seekBarCursor = function (e) {

    var rect = player.elements.progress_bar.getBoundingClientRect(),
        mouse_x = event.clientX;

    if (mouse_x < rect.left) mouse_x = rect.left;
    if (mouse_x >= rect.right) mouse_x = rect.right - 1;

    mouse_x -= rect.left

    var percent = mouse_x * 100 / rect.width,
        position = percent - 100;

    // adaptation time
    player.elements.video.currentTime = percent * player.elements.video.duration / 100;
    // adaotation progress
    player.elements.progress_bar.progress.style.transform = 'translateX(' + position + '%)';
    // adaptation timer
    player.elements.timer_box.style.transform = 'translateX(' + mouse_x + 'px)';

}

player.elements.progress_bar.addEventListener('click', seekBarCursor);

// Drag on seek bar
var wasPlaying = false;

player.elements.progress_bar.addEventListener('mousedown', function (e) {
    wasPlaying = !player.elements.video.paused
    player.elements.video.pause();
    document.addEventListener('mousemove', seekBarCursor);
});

document.addEventListener('mouseup', function (e) {
    if (wasPlaying) {
        player.elements.video.play();
        wasPlaying = false
    }
    document.removeEventListener('mousemove', seekBarCursor);
});

// Update timer
player.elements.video.addEventListener('timeupdate', function () {
    var m = Math.floor(player.elements.video.currentTime / 59);
    if (m < 10) m = '0' + m;
    var s = Math.floor(player.elements.video.currentTime) % 59;
    if (s < 10) s = '0' + s;
    player.elements.timer.innerHTML = m + ':' + s;
});

// Change Volume
player.elements.sound.addEventListener('click', function (vol) {
    var rect = player.elements.sound.getBoundingClientRect(),
        mouse_x = vol.clientX - rect.left;
        percent = mouse_x * 100 / rect.width,
        position = percent - 100,
        sound = percent / 100;

    if (sound > 0.9) {
        sound = 1;
        position = 0;
    }

    if (sound < 0.13) {
        sound = 0;
        position = -100;
    }

    player.elements.video.volume = sound;
    player.elements.sound.sound_progress.style.transform = 'translateX(' + position + '%)';

});

// Toggle box-qualitie
player.elements.HD_quality.addEventListener('click', function (HD) {
    player.elements.box_quality.classList.toggle('invisible');
});

// Changement de qualité
var changeQuality = function (choice) {
    player.elements.video.pause();
    var temps = player.elements.video.currentTime;
    player.elements.video.src = choice + '.mp4';
    player.elements.video.currentTime = temps;
    player.elements.video.play();
}

player.elements.box_quality.low.addEventListener('click', function () {
    changeQuality('low');
});

player.elements.box_quality.hight.addEventListener('click', function () {
    changeQuality('hight');
});



player.elements.full_screen_button.addEventListener('click', function (e) {

    var rfs = player.elements.player.requestFullscreen
            || player.elements.player.webkitRequestFullScreen
            || player.elements.player.mozRequestFullScreen
            || player.elements.player.msRequestFullscreen

    rfs.call(player.elements.player);


});



