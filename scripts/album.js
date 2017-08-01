// Example album
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    index: 1,
    songs: [
      { title: 'Blue', duration: '4:26' },
      { title: 'Green', duration: '3:14' },
      { title: 'Red', duration: '5:01' },
      { title: 'Pink', duration: '3:21' },
      { title: 'Magenta', duration: '2:15' },
    ]
};

//Another Album Exmaple
var albumMarconi = {
  title: 'The Telephone',
  artist: 'Gugielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtUrl: 'assets/images/album_covers/20.png',
  index: 2,
  songs : [
    { title: 'Hello, Operator?', duration: '1:01' },
    { title: 'Ring, ring, ring', duration: '5:01' },
    { title: 'Fits in your pocket', duration: '3:21' },
    { title: 'Can you hear me now?', duration: '3:14' },
    { title: 'Wrong phone number', duration: '2:15' },
  ]
};

var albumInfected = {
    title: 'Army of Mushrooms',
    artist: 'Infected Mushroom',
    label: 'Dim Mak Records',
    year: '2012',
    index: 3,
    albumArtUrl: 'assets/images/album_covers/22.jpg',
    songs: [
      { title: 'Never Mind', duration: '6:28' },
      { title: 'Nothing to Say', duration: '5:24' },
      { title: 'Send Me an Angel', duration: '3:41' },
      { title: 'U R So F**ked', duration: '5:25' },
      { title: 'The Rat', duration: '6:15' },
      { title: 'Nation of Wusses', duration: '3:22' },
      { title: 'Wanted To', duration: '5:55' },
      { title: 'Save My Thirst', duration: '6:21' },
      { title: 'I Shine', duration: '6:33' },
      { title: 'Drum n Bassa', duration: '4:44'},
      { title: 'The Pretender', duration: '6:51' },
      { title: 'The Messenger 2012', duration: '4:22' },
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'
    + '   <td class="song-item-number">' + songNumber + '</td>'
    + '   <td class="song-item-title">' + songName + '</td>'
    + '   <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;

    return template;
};

var currentAlbum;

var setCurrentAlbum = function(album) {
  var albumTitle = document.getElementsByClassName('album-view-title')[0];
  var albumArtist = document.getElementsByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
  var albumImage = document.getElementsByClassName('album-cover-art')[0];
  var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
  albumImage.setAttribute('src', album.albumArtUrl);

  albumSongList.innerHTML = '';

  for (var i = 0; i < album.songs.length; i++) {
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
  currentAlbum = albumTitle.innerText;
};

window.onload = function() {
    setCurrentAlbum(albumInfected);
};

var changeByCover = function () {
  if (currentAlbum === 'The Colors') {
    setCurrentAlbum(albumMarconi)
  } else if (currentAlbum === 'The Telephone') {
    setCurrentAlbum(albumInfected)
  } else if (currentAlbum === 'Army of Mushrooms') {
    setCurrentAlbum(albumPicasso)
  }
};

var x = document.getElementsByClassName('album-cover-art')[0];
x.addEventListener("click", changeByCover);

console.log(x);
