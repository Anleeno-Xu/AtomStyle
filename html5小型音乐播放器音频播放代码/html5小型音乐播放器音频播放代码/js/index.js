$(function()
{
    var art_img=['_1','_2','_3','_4','_5','_6','_7','_8','_9','_10','_11','_12','_13','_14','_15','_16','_17','_18','_19','_20','_21','_22','_23','_24','_25','_26','_27'];
    var artist_name=['张艺兴','소녀시대 Oh!GG','소녀시대','TaeTiSeo','泰妍(태연)','泰妍(태연)','Super Junior','TaeTiSeo','张艺兴','소녀시대','BoA','Super Junior(D&E)','소녀시대','Red Velvet','Red Velvet','BLACKPINK','BLACKPINK','BLACKPINK','소녀시대','SHINee','Madison Beer/미연/전소연/Jaira Burns','Aaron Cole','Apink','소녀시대','f(x)','泠鸢yousa','JUNIEL'];
    var album_name=['梦不落雨林', 'Fermata', 'Talk Talk', 'Only U', 'Rescue Me', 'VOICE', '너라고', 'Baby Steps', '一个人', 'Promise', 'MASAYUME CHASING', 'Growing Pains', 'PARTY', 'Bad Boy', 'Psycho', 'Really', 'As If Its Your Last', 'WHISTLE', 'DIVINE', 'Hello', 'POP STARS', 'Steady Me', '如果你向我招手', 'Indestructible', '4 Walls', '前前前世(Slow Ver)', 'illa illa'];
    var music_url=['music/01_张艺兴-梦不落雨林.mp3', 'music/02_Fermata_少女时代-OhGG.mp3', 'music/03_TalkTalk_少女时代.mp3', 'music/04_OnlyU_少女时代-泰蒂徐.mp3', 'music/05_RescueMe_太妍.mp3', 'music/06_太妍-VOICE.mp3', 'music/07_its_you_SuperJunior.mp3', 'music/08_BabySteps_少女时代-泰蒂徐.mp3', 'music/09_一个人_张艺兴.mp3', 'music/10_Promise_少女时代.mp3', 'music/11_BoA-MASAYUME_CHASING.mp3', 'music/12_GrowingPains_SJ_DE.mp3', 'music/13_PARTY_少女时代.mp3', 'music/14_RedVelvet-BadBoy.mp3', 'music/15_RedVelvet-Psycho.mp3', 'music/16_BLACKPINK-Really.mp3', 'music/17_BLACKPINK-As_If_Its_Your_Last.mp3', 'music/18_BLACKPINK-WHISTLE.mp3', 'music/19_DIVINE_少女时代.mp3', 'music/20_Hello_SHINee.mp3', 'music/21_POP_STARS.mp3', 'music/22_SteadyMe_AaronCole.mp3', 'music/23_Apink_如果你向我招手.mp3', 'music/24_Indestructible_少女时代.mp3', 'music/25_4Walls_fx.mp3', 'music/26_泠鸢yousa_前前前世SlowVer.mp3', 'music/27_illa_illa_JUNIEL.mp3']


    var playerTrack = $("#player-track"), bgArtwork = $('#bg-artwork'), bgArtworkUrl, albumName = $('#album-name'), trackName = $('#track-name'), albumArt = $('#album-art'), sArea = $('#s-area'), seekBar = $('#seek-bar'), trackTime = $('#track-time'), insTime = $('#ins-time'), sHover = $('#s-hover'), playPauseButton = $("#play-pause-button"),  i = playPauseButton.find('i'), tProgress = $('#current-time'), tTime = $('#track-length'), seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false, albums = album_name, trackNames = artist_name, albumArtworks = art_img, trackUrl = music_url, playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;

    function playPause()
    {
        setTimeout(function()
        {
            if(audio.paused)
            {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class','iconfont icon-zanting');
                audio.play();
            }
            else
            {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class','iconfont icon-icon_play');
                audio.pause();
            }
        },300);
    }

    	
	function showHover(event)
	{
		seekBarPos = sArea.offset(); 
		seekT = event.clientX - seekBarPos.left;
		seekLoc = audio.duration * (seekT / sArea.outerWidth());
		
		sHover.width(seekT);
		
		cM = seekLoc / 60;
		
		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
		
		if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
        if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
		if(ctMinutes < 10)
			ctMinutes = '0'+ctMinutes;
		if(ctSeconds < 10)
			ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
		    insTime.text(ctMinutes+':'+ctSeconds);
            
		insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
		
	}

    function hideHover()
	{
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
    }
    
    function playFromClickedPos()
    {
        audio.currentTime = seekLoc;
		seekBar.width(seekT);
		hideHover();
    }

    function updateCurrTime()
	{
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            trackTime.addClass('active');
        }

		curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
		
		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);
		
		playProgress = (audio.currentTime / audio.duration) * 100;
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
		    tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            tTime.text('00:00');
        else
		    tTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');

        
		seekBar.width(playProgress+'%');
		
		if( playProgress == 100 )
		{
			i.attr('class','iconfont icon-icon_play');
			seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
		}
    }
    
    function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }

    function selectTrack(flag)
    {
        if( flag == 0 || flag == 1 )
            ++currIndex;
        else
            --currIndex;

        if( (currIndex > -1) && (currIndex < albumArtworks.length) )
        {
            if( flag == 0 )
                i.attr('class','iconfont icon-icon_play');
            else
            {
                albumArt.removeClass('buffering');
                i.attr('class','iconfont icon-zanting');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');

            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];

            audio.src = trackUrl[currIndex];
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find('img.active').removeClass('active');
            $('#'+currArtwork).addClass('active');
            
            bgArtworkUrl = $('#'+currArtwork).attr('src');

            bgArtwork.css({'background-image':'url('+bgArtworkUrl+')'});
        }
        else
        {
            if( flag == 0 || flag == 1 )
                --currIndex;
            else
                ++currIndex;
        }
    }

    function initPlayer()
	{	
        audio = new Audio();

		selectTrack(0);
		
		audio.loop = false;
		
		playPauseButton.on('click',playPause);
		
		sArea.mousemove(function(event){ showHover(event); });
		
        sArea.mouseout(hideHover);
        
        sArea.on('click',playFromClickedPos);
		
        $(audio).on('timeupdate',updateCurrTime);

        playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
        playNextTrackButton.on('click',function(){ selectTrack(1);});
	}
    
	initPlayer();
});