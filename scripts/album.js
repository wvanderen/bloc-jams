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
      var songNumber = $(this).attr('data-song-number');

      if (currentlyPlayingSong !== null) {
      //Revert to song number for currently playing song when user starts playing new song
        var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
        currentlyPlayingCell.html(currentlyPlayingSong);
      }
      if (currentlyPlayingSong !== songNumber) {
        //Switch from play to pause button to indicate new song is playing.
        $(this).html(pauseButtonTemplate);
        currentlyPlayingSong = songNumber;
      }
      else if (currentlyPlayingSong === songNumber) {
       //Swtich from pause to play button to pause currently playing song
        $(this).html(playButtonTemplate);
        currentlyPlayingSongNumber = null;
        currentSongFromAlbum = null;
      }
        else if (currentlyPlayingSongNumber !== $(this).attr('data-song-number')) {
          //switch from play--> pause button to indicate a new song is playing.
          $(this).html(pauseButtonTemplate);
          currentlyPlayingSongNumber = songItem;
          currentSongFromAlbum = currentAlbum.songs[songItem - 1];
      }

      var updatePlayerBarSong = function() {
        $('h2.song-name').text($('.song-item-title'));
        $('h2.artist-song-mobile').text($('.song-item-title') + $('.album-view-artist'));
        $('h2.artist-name').text($('.album-view-artist'));
      };
    };

    var onHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = songNumberCell.attr('data-song-number');

      if (songNumber !== currentlyPlayingSong) {
        songNumberCell.html(playButtonTemplate);
      }
    };


    var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
          songNumberCell.html(songNumber);
        }
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

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

//Stores current album displayed
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
//Holds currently playing song object from songs array
var currentSongFromAlbum = null;

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
});
