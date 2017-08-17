var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'
    + '   <td class="song-item-number" data-song-number="' + songNumber + '">' +songNumber + '</td>'
    + '   <td class="song-item-title">' + songName + '</td>'
    + '   <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
    + '</tr>'
    ;

    var $row = $(template);

    var clickHandler = function() {

      var updatePlayerBarSong = function() {
        //Updates text in player bar based on current song
        $('.currently-playing .song-name').text(currentSongFromAlbum.title);
        $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + currentAlbum.artist);
        $('.currently-playing .artist-name').text(currentAlbum.artist);
        //Updates status of play/pause button in playerbar
        $('.main-controls .play-pause').html(playerBarPauseButton);
        setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
      };

      var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
      //Revert to song number for currently playing song when user starts playing new song
        var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }
      if (currentlyPlayingSongNumber !== songNumber) {
        //Switch from play to pause button to indicate new song is playing and play the sound file
        $(this).html(pauseButtonTemplate);
        setSong(songNumber);
        updatePlayerBarSong();
        currentSoundFile.play(currentSoundFile);
        updateSeekBarWhileSongPlays();
        $('.player-bar .volume .seek-bar .fill').css({
          width: currentVolume + '%'
        });
        $('.player-bar .volume .thumb').css({
          left: currentVolume + '%'
        });

      }
      else if (currentlyPlayingSongNumber === songNumber) {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        if (currentSoundFile.isPaused(currentSoundFile)) {
          //Start playing the song again and revert the icon in the row and player bar to pause button
          currentSoundFile.play(currentSoundFile);
          $(this).html(pauseButtonTemplate);
          updateSeekBarWhileSongPlays();
        } else {
          //pause it and set the content of the song number cell and playerbar to the play button
          currentSoundFile.pause(currentSoundFile);
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
        }
      }
    };

    var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

      if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
      }
    };


    var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(songNumber);
        }
      console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
      };


    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
  var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  $albumSongList.append($newRow);
  }
};

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    //Binds timeupdate to currentSoundFile
    currentSoundFile.bind('timeupdate', function(event) {
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');
      var currentTime = this.getTime();

      setCurrentTimeInPlayerBar(currentTime);
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  //Multiply ratio by 100 and keep it within 0-100, then convert it to a string with % appended
  //Use it to set width percentage of bars
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    //Gets value that is a propertion of the seek bar
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    //Calculating seekBarFillRatio
    var seekBarFillRatio = offsetX / barWidth;
    //Passingto into updateSeekPercentage
    updateSeekPercentage($(this), seekBarFillRatio);

    if ($(this).parent().attr('class') === 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      currentSoundFile.setVolume(seekBarFillRatio * 100);
    };
  });
//Use mousedown event to track when thumb is pressed and held. Setting this equal to the thumb node that was clicked
  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      updateSeekPercentage($seekBar, seekBarFillRatio);

      if ($seekBar.parent().attr('class') === 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        currentSoundFile.setVolume(seekBarFillRatio * 100);
      };
    });
    //Configures the thumb and fill to unbind the mouse when the button is released
    $(document).bind('mouseup.thumb',function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
    });
};

var trackIndex = function(album,song) {
  //Returns index of song found in album's songs array
  return album.songs.indexOf(song);
};

var nextSong = function() {
  var nextSongNumber = parseInt($(this).attr('data-song-number'));
  //gets number of new song to set. Loops around if last song
  if (trackIndex(currentAlbum, currentSongFromAlbum) < (currentAlbum.songs.length -1)) {
      nextSongNumber = (trackIndex(currentAlbum, currentSongFromAlbum) +2);
  } else {
      nextSongNumber = 1;
  }
  var updatePlayerBarSong = function() {
    //Updates text in player bar based on current song
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    //Updates status of play/pause button in playerbar
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
  };

    //Sets previously playing song to a number and sets currentlyPlayingSongNumber to new song
    //Plays next song
    var previouslyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    previouslyPlayingCell.html(currentlyPlayingSongNumber);
    setSong(nextSongNumber);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    //Sets new song to pause button and updates player bar
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(pauseButtonTemplate);
    updatePlayerBarSong();
};

var previousSong = function () {
  var previousSongNumber = parseInt($(this).attr('data-song-number'));

    //Gets number of new song to set. Loops around if first song
    if (trackIndex(currentAlbum, currentSongFromAlbum) > 0) {
      previousSongNumber = trackIndex(currentAlbum, currentSongFromAlbum);
    } else {
      previousSongNumber = currentAlbum.songs.length;
    }

  var updatePlayerBarSong = function() {
    //Updates text in player bar based on current song
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    //Updates status of play/pause button in playerbar
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
  };

  //Sets previously playing song to a number and sets currentlyPlayingSongNumber to new song
    var previouslyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    previouslyPlayingCell.html(currentlyPlayingSongNumber);
  //Sets new song to pause button and updates player bar
  //Starts playing previous song
    setSong(previousSongNumber);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(pauseButtonTemplate);
    updatePlayerBarSong();
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

//Stores current album displayed
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
//Holds currently playing song object from songs array
var currentSongFromAlbum = null;
//Stores sound object when new current song is set
var currentSoundFile = null;
//Holds the volumn
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

var setSong = function(songNumber) {
if (currentSoundFile) {
  currentSoundFile.stop();
}

buzz.defaults.formats = ['mp3', 'wav'];

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  //Creates new buzz sound object. Defines format and preload settings
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: [ 'wav', 'mp3'],
    preload: true
  });

  setVolume(currentVolume);
};

var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
}

var togglePlayFromPlayerBar = function() {
  if (currentSoundFile.isPaused(currentSoundFile)) {
    //If play button is clicked when a song is paused we change both play buttons to pause and play the song
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(playerBarPauseButton);
    $(this).html(playerBarPauseButton);
    currentSoundFile.play(currentSoundFile);
  } else if (currentSoundFile) {
    //If the pause button is clicked we pause the song and change the pause buttons to play
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(playerBarPlayButton);
      $(this).html(playerBarPlayButton);
      currentSoundFile.pause(currentSoundFile);
  }
};

var setCurrentTimeInPlayerBar = function(currentTime) {
  //sets text of element with class .current-time to current time in song
  $('.current-time').text(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime) {
  //sets the text of the element with class .total time to the length of the song.
  $('.seek-control .total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds) {
  var totalSeconds = parseFloat(timeInSeconds);
  var minutes = Math.floor(totalSeconds / 60);
//Seconds calculation and formatting
  if (totalSeconds > 9) {
    var seconds = Math.floor(totalSeconds % 60);
  } else seconds = "0" + Math.floor(totalSeconds % 60);
//Return formatted time
  var currentTime = minutes + ":" + seconds;
  return currentTime;
};

$(document).ready(function() {
    setCurrentAlbum(albumCarpeLiam);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playPause.click(togglePlayFromPlayerBar);
    setupSeekBars();
});
