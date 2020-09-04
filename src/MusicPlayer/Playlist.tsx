var PlaylistData = [
    {
      "id": "1111",
      "url": "https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj",
      "title": "Longing",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/100/200/200.jpg",
      "duration": 143
    },
    {
      "id": "2222",
      "url": "https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E",
      "title": "Soul Searching (Demo)",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/200/200/200.jpg",
      "duration": 77
    },
    {
      "id": "3333",
      "url": "https://drive.google.com/uc?export=download&id=1bmvPOy2IVbkUROgm0dqiZry_miiL4OqI",
      "title": "Lullaby (Demo)",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/300/200/200.jpg",
      "duration": 71
    },
    {
      "id": "4444",
      "url": "https://drive.google.com/uc?export=download&id=1V-c_WmanMA9i5BwfkmTs-605BQDsfyzC",
      "title": "Rhythm City (Demo)",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/400/200/200.jpg",
      "duration": 106
    },
    {
        "id": "5555",
        "url": "https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj",
        "title": "Longing",
        "artist": "David Chavez",
        "artwork": "https://i.picsum.photos/id/100/200/200.jpg",
        "duration": 143
      },
      {
        "id": "6666",
        "url": "https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E",
        "title": "Soul Searching (Demo)",
        "artist": "David Chavez",
        "artwork": "https://i.picsum.photos/id/200/200/200.jpg",
        "duration": 77
      },
      {
        "id": "7777",
        "url": "https://drive.google.com/uc?export=download&id=1bmvPOy2IVbkUROgm0dqiZry_miiL4OqI",
        "title": "Lullaby (Demo)",
        "artist": "David Chavez",
        "artwork": "https://i.picsum.photos/id/300/200/200.jpg",
        "duration": 71
      },
      {
        "id": "8888",
        "url": "https://drive.google.com/uc?export=download&id=1V-c_WmanMA9i5BwfkmTs-605BQDsfyzC",
        "title": "Rhythm City (Demo)",
        "artist": "David Chavez",
        "artwork": "https://i.picsum.photos/id/400/200/200.jpg",
        "duration": 106
      }
]

export default PlaylistData

/*

useTrackPlayerEvents(events, async (event) => {
  if (event.type === TrackPlayerEvents.PLAYBACK_QUEUE_ENDED) {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  console.log('current track:',currentTrack)
 
    console.log('current track null')
  
    var PlaylistData= [];
  /*  PlaylistData = [
    {
      "id": "1111",
      "url": "https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj",
      "title": "Longing",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/100/200/200.jpg",
      "duration": 143
    },
    {
      "id": "2222",
      "url": "https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E",
      "title": "Soul Searching (Demo)",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/200/200/200.jpg",
      "duration": 77
    },
    {
      "id": "3333",
      "url": "https://drive.google.com/uc?export=download&id=1bmvPOy2IVbkUROgm0dqiZry_miiL4OqI",
      "title": "Lullaby (Demo)",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/300/200/200.jpg",
      "duration": 71
    },
    {
      "id": "4444",
      "url": "https://drive.google.com/uc?export=download&id=1V-c_WmanMA9i5BwfkmTs-605BQDsfyzC",
      "title": "Rhythm City (Demo)",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/400/200/200.jpg",
      "duration": 106
    },
    {
        "id": "5555",
        "url": "https://drive.google.com/uc?export=download&id=1AjPwylDJgR8DOnmJWeRgZzjsohi-7ekj",
        "title": "Longing",
        "artist": "David Chavez",
        "artwork": "https://i.picsum.photos/id/100/200/200.jpg",
        "duration": 143
    },
    {
        "id": "6666",
        "url": "https://drive.google.com/uc?export=download&id=1VM9_umeyzJn0v1pRzR1BSm9y3IhZ3c0E",
        "title": "Soul Searching (Demo)",
        "artist": "David Chavez",
        "artwork": "https://i.picsum.photos/id/200/200/200.jpg",
        "duration": 77
    },
    {
        "id": "8888",
        "url": "https://drive.google.com/uc?export=download&id=1V-c_WmanMA9i5BwfkmTs-605BQDsfyzC",
        "title": "Rhythm City (Demo)",
        "artist": "David Chavez",
        "artwork": "https://i.picsum.photos/id/400/200/200.jpg",
        "duration": 106
    },
    {
      "id": "7777",
      "url": "https://drive.google.com/uc?export=download&id=1bmvPOy2IVbkUROgm0dqiZry_miiL4OqI",
      "title": "Lullaby (Demo)",
      "artist": "David Chavez",
      "artwork": "https://i.picsum.photos/id/300/200/200.jpg",
      "duration": 71
  },
  ] 
      await TrackPlayer.add(PlaylistData);
      await TrackPlayer.play(); 
      if (currentTrack !== null) {
  } else {
    console.log('the current track is present')
    if (playbackState === TrackPlayer.STATE_PAUSED) {
      await TrackPlayer.play();
    }
  }
}
}) */