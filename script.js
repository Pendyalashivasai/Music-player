const audioPlayer = document.getElementById('audio-player');
const playPauseButton = document.getElementById('play-pause');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const progress = document.getElementById('progress');
const trackTitle = document.querySelector('.music-player p');
const trackArtist = document.querySelector('.music-player h2');
const visualizer = document.getElementById('visualizer');
const canvasCtx = visualizer.getContext('2d');
const songs = document.querySelectorAll('.song');
const albumCover = document.querySelector('.album-cover img');
const songElements = document.querySelectorAll('.song');
const songContainers = document.querySelectorAll('.song-container .song');
const songList = [...document.querySelectorAll('.song')]; // get all song elements

const tracks = [
    { title: 'Po ve Po', artist: 'Anirudh', src: 'songs/[iSongs.info] 06 - Po Ve Po.mp3', image: 'images/album-cover-1.jpg' },
    { title: 'Nijame ne chepthuna', artist: 'Sid sriram', src: 'songs/Nijame Ne Chebuthunna.mp3', image: 'images/album-cover-2.jpg' },
    { title: 'Sooseki', artist: 'Shreya Ghoshal', src: 'songs/Soseki(PaglaSongs).mp3', image: 'images/album-cover-3.jpg' },
    { title: 'My Heart', artist: 'KK', src: 'songs/[iSongs.info] 02 - My Heart Is Beating.mp3', image: 'images/album-cover-4.jpg' },
    { title: 'Velipomake', artist: 'sid sriram', src: 'songs/Vellipomaake-SenSongsMp3.Com.mp3 ', image: 'images/sahasam.jpg' }
];
songs.forEach(song => {
    song.addEventListener('click', () => {
        const songIndex = Array.from(songs).indexOf(song); 
        currentTrackIndex = songIndex; 
        loadTrack(currentTrackIndex); 
        audioPlayer.play();
        playPauseButton.innerHTML = '<i class="material-icons">pause</i>';
    
    });
});
let currentTrackIndex = 0;
let audioCtx;
let analyser;
let bufferLength;
let dataArray;
let currentSongIndex = 0;
let isShuffle = false;


document.getElementById('shuffle').addEventListener('click', () => {
    isShuffle = !isShuffle;
    if (isShuffle) {
      shuffleSongs();
    } else {
      
      songList.forEach((song, index) => {
        song.style.order = index;
      });
    }
  });
  
  function shuffleSongs() {
    for (let i = songList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songList[i], songList[j]] = [songList[j], songList[i]];
    }
    songList.forEach((song, index) => {
      song.style.order = index;
    });
}
function playShuffledSong() {
  currentSongIndex = 0;
  const shuffledSong = songList[currentSongIndex].querySelector('audio');
  audioPlayer.src = shuffledSong.src;
  audioPlayer.play();
}

songElements.forEach((song) => {
    song.addEventListener('click', () => {
    
      songElements.forEach((s) => s.classList.remove('active'));

      song.classList.add('active');
    });
  });


function loadTrack(index) {
    const track = tracks[index];
    audioPlayer.src = track.src;
    trackTitle.textContent = `${track.title} - ${track.artist}`;
    trackArtist.textContent = track.title;
    albumCover.src = track.image;
    setupVisualizer();
    updateProgressBar();
 
}
function playSong(songIndex) {

    songContainers.forEach((song) => song.classList.remove('playing'));
  
  
    songContainers[songIndex].classList.add('playing');
  }

function playPauseTrack() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.innerHTML = '<i class="material-icons">pause</i>';
    } else {
        audioPlayer.pause();
        playPauseButton.innerHTML = '<i class="material-icons">play_arrow</i>';
    }
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    playPauseButton.innerHTML = '<i class="material-icons">pause</i>';
    
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    audioPlayer.play();
    playPauseButton.innerHTML = '<i class="material-icons">pause</i>';
    
}

function updateProgress() {
    
    const progressValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
   
    progress.value = progressValue;
    updateProgressBar();
}

function updateProgressBar() {
    const value = progress.value;
    progress.style.background = `linear-gradient(to right, #333 ${value}%, #ddd ${value}%)`;
}

function seek(event) {
    const seekTime = (event.target.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
    updateProgressBar();
}

playPauseButton.addEventListener('click', playPauseTrack);
prevButton.addEventListener('click', prevTrack);
nextButton.addEventListener('click', nextTrack);
audioPlayer.addEventListener('timeupdate', updateProgress);
progress.addEventListener('input', seek);

window.onload = () => {
    loadTrack(currentTrackIndex);
    setupVisualizer();
};
audioPlayer.addEventListener('ended', nextTrack);
function setupVisualizer() {
   
    // Create audio context in response to user interaction
    playPauseButton.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(audioPlayer);
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            source.connect(analyser);
            analyser.connect(audioCtx.destination);

            drawVisualizer();

        }
   
      });
    }

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, visualizer.width, visualizer.height);

    const width = visualizer.width;
    const height = visualizer.height;
    const centerX = width / 2;
    const centerY = height / 2;

    //gradient for the wave color
    const gradient = canvasCtx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#FA00FF');
    gradient.addColorStop(0.2, '#BE3EFF');
    gradient.addColorStop(0.4, '#A05DFF');
    gradient.addColorStop(0.6, '#748BFF');
    gradient.addColorStop(0.8, '#00ffff');
    gradient.addColorStop(1, '#0000ff');

    // wave color
    canvasCtx.strokeStyle = gradient;
    canvasCtx.lineWidth = 4;
    canvasCtx.shadowColor = '#ffffff'; 
    canvasCtx.shadowBlur = 5; 

    // Draw multiple waves
    const wavesCount = 3;
    for (let j = 0; j < wavesCount; j++) {
        canvasCtx.beginPath();
        const frequency = (j + 1) * 1;
        const amplitude = height / (wavesCount * 2) * (j + 1) * 0.5;
        for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i] / 255;
            const x = (i / bufferLength) * width;
            const y = centerY + amplitude * Math.sin((x / width) * frequency * Math.PI * 2 + (Date.now() / 1000));
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
        }
        canvasCtx.stroke();
    }

    //  reflection of waves
    canvasCtx.globalAlpha = 0.3;
    canvasCtx.shadowBlur = 5; 
    for (let j = 0; j < 3; j++) {
        canvasCtx.beginPath();
        let frequency, amplitude;

        if (j === 0) {
            frequency = 2;
            amplitude = height / 6;
        } else {
            frequency = 2 + j * 0.3;
            amplitude = height / 6 + j * 5; 
        }

        for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i] / 255;
            const x = (i / bufferLength) * width;
            const y = height - (height - centerX - amplitude * Math.sin((x / width) * frequency * Math.PI * 2 + (Date.now() / 1000))); 
            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }
        }
        canvasCtx.stroke();
    }
    canvasCtx.globalAlpha = 1; 
}


visualizer.width = visualizer.offsetWidth;
visualizer.height = visualizer.offsetHeight;
window.addEventListener('resize', () => {
    visualizer.width = visualizer.offsetWidth;
    visualizer.height = visualizer.offsetHeight;
});

