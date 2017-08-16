var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'
    + '   <td class="song-item-number" data-song-number="' + songNumber + '">' +songNumber + '</td>'
    + '   <td class="song-item-title">' + songName + '</td>'
    + '   <td class="song-item-duration">' + songLength + '</td>'
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
      };

      var songNumber = parseInt($(this).attr('data-song-number'));

      if (currentlyPlayingSongNumber !== null) {
      //Revert to song number for currently playing song when user starts playing new song
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
        currentlyPlayingCell.html(currentlyPlayingSongNumber);
      }
      if (currentlyPlayingSongNumber !== songNumber) {
        //Switch from play to pause button to indicate new song is playing.
        $(this).html(pauseButtonTemplate);
        currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        updatePlayerBarSong();
      }
      else if (currentlyPlayingSongNumber === songNumber) {
       //Swtich from pause to play button to pause currently playing song
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
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
  };

    //Sets previously playing song to a number and sets currentlyPlayingSongNumber to new song
    var previouslyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    previouslyPlayingCell.html(currentlyPlayingSongNumber);
    currentlyPlayingSongNumber = nextSongNumber;
    currentSongFromAlbum = currentAlbum.songs[nextSongNumber - 1];
    //Sets new song to pause button and updates player bar
    currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
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
  };

  //Sets previously playing song to a number and sets currentlyPlayingSongNumber to new song
    var previouslyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    previouslyPlayingCell.html(currentlyPlayingSongNumber);
    currentlyPlayingSongNumber = previousSongNumber;
    currentSongFromAlbum = currentAlbum.songs[previousSongNumber - 1];
  //Sets new song to pause button and updates player bar
    currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
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

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});
