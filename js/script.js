let songs;
let curfolder;
let shuffle;
let cursong = new Audio();
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


const playmusic = (c) => {
    cursong.src = `/${curfolder}/` + c + ".mp3";
    cursong.play();
    document.querySelector(".songbut").getElementsByTagName("img")[1].src = "/img/play.svg"
    document.querySelector(".songinfo").innerHTML = c
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    
}

async function getsongs(folder) {
    curfolder = folder;
    let a = await fetch(`/${curfolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${curfolder}/`)[1]);
        }
    }


    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        var sn = song.replaceAll("%20", " ");
        sn = sn.replaceAll(".mp3", "");
        songul.innerHTML = songul.innerHTML + `<li>
                            <img src="/img/music.svg" class="invert">
                                <div class="info">
                                    <div style="font-weight : bold;" class="details">${sn.split("-")[0]}</div>
                                    <div style="font-size : 14px;font-weight : 400;" class="details">${sn.split("-")[1]}</div>
                                </div>
                                <div class="playnow">
                                    <pre>Play Now</pre>
                                    <img src="img/pause.svg" class="invert" id="playi">
                                </div>
                            </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", item => {
            let c = e.querySelector(".info").firstElementChild.innerHTML.trim() + " - " + e.querySelector(".info").getElementsByTagName("div")[1].innerHTML.trim();
            playmusic(c)
        })
    })
    return songs
}

async function disal() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let ar = Array.from(anchors)
    for (let i = 0; i < ar.length; i++) {
        const e = ar[i];
        if (e.href.includes("/songs/")) {
            let folder = (e.href.split("/")[4])
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            document.querySelector(".cardcont").innerHTML = document.querySelector(".cardcont").innerHTML + `<div class="card" data-folder = "${folder}">
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h1 style="font-size: 20px;">${response.title}</h1>
                        <p style="font-size: 15px;">${response.description}</p>
                        <div class="play">
                            <i class="fa-solid fa-play"></i>
                        </div>
                    </div>`
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0].replaceAll("%20", " ").replaceAll(".mp3", ""))
        })

    })
}

async function main() {

    await getsongs("songs/")
    disal()
    play.addEventListener("click", () => {
        if (cursong.paused) {
            cursong.play();
            play.src = "/img/play.svg"

        }
        else {
            cursong.pause()
            play.src = "/img/pause.svg"
        }
    })
    cursong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(cursong.currentTime)} / ${secondsToMinutesSeconds(cursong.duration)}`
        document.querySelector(".circle").style.left = (cursong.currentTime / cursong.duration) * 100 + "%"
        document.querySelector(".songlev").style.width = (cursong.currentTime / cursong.duration) * 100 + "%"
        if (cursong.currentTime === cursong.duration){
            let index = songs.indexOf((cursong.src.split("/")[5]))
            if(!shuffle){
            if (index < songs.length - 1) {
            let i = (songs[index + 1].replaceAll("%20", " ").replaceAll(".mp3", ""))
            playmusic(i)
            }
            else
            {
                document.querySelector(".songbut").getElementsByTagName("img")[1].src = "/img/pause.svg"
                cursong.currentTime = 0.0
                document.querySelector(".circle").style.left = "0%"

            }
        }
    
        }

    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        document.querySelector(".circle").style.left = ((e.offsetX / e.target.getBoundingClientRect().width) * 100) + "%"
        cursong.currentTime = (e.offsetX / e.target.getBoundingClientRect().width) * (cursong.duration)
        document.querySelector(".songlev").style.width = ((e.offsetX / e.target.getBoundingClientRect().width) * 100) + "%"
    })
    document.querySelector(".volseek").addEventListener("click", e => {
        document.querySelector(".volcir").style.left = ((e.offsetX / e.target.getBoundingClientRect().width) * 100) + "%"
        document.querySelector(".vollev").style.width = ((e.offsetX / e.target.getBoundingClientRect().width) * 100) + "%"
        cursong.volume = e.offsetX / e.target.getBoundingClientRect().width;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-200%"
    })
    let x = document.querySelector(".vol");
    x.addEventListener("click", e => {
        if (!cursong.muted) {
            vo.src = "/img/mute.svg";
            cursong.muted = true;
            document.querySelector(".volcir").style.left = "0%";
            document.querySelector(".vollev").style.width = "0%";
        }
        else if (cursong.muted) {
            vo.src = "/img/volume.svg";
            cursong.muted = false;
            document.querySelector(".volcir").style.left = "100%";
            document.querySelector(".vollev").style.width = "100%";
        }
    })


    prev.addEventListener("click", () => {
        let index = songs.indexOf((cursong.src.split("/")[5]))
        if (index > 0) {
            let i = (songs[index - 1].replaceAll("%20", " ").replaceAll(".mp3", ""))
            playmusic(i)
        }
    })
    next.addEventListener("click", () => {
        let index = songs.indexOf((cursong.src.split("/")[5]))
        if (index < songs.length - 1) {
            let i = (songs[index + 1].replaceAll("%20", " ").replaceAll(".mp3", ""))
            playmusic(i)
        }
    })
    

}
main()