const splitInfo = (x, dateDefault) => {
    const strSplit = x.split(' - ')
    arrayMinSec = strSplit[0].split(':')
    const miliseconds = (arrayMinSec[0]/60 + arrayMinSec[1]) * 1000
    console.log(miliseconds/1000)
    return {
        date: new Date(dateDefault.getTime() + miliseconds),
        url: strSplit[1],
    }
}

const formatTimeUniqueSeconds = (date) => `${date.getHours()},${date.getSeconds()},${date.getMinutes()}`

setTimeout(()=>{
    const description = document.querySelector('#content #description').textContent
    const player = document.querySelector('#movie_player video')

    const dateStartVideo = new Date()
    const getPlayerDate = () => new Date(dateStartVideo.getTime() + player.currentTime * 1000)
    
    const matchedCited = [...description.matchAll(/\d{1,2}:\d{1,2} - https:\/\/[\w,.,\/]+/g)]
        .map(x=>splitInfo(x[0], dateStartVideo))
    
    console.log(matchedCited)

    let lastTime = formatTimeUniqueSeconds(dateStartVideo)
    player.ontimeupdate = () => { 
        const playerDate = getPlayerDate()
        const newTime = formatTimeUniqueSeconds(playerDate)
        if (lastTime !== newTime) {
            lastTime = newTime
            const cited = matchedCited.find(x=>(
                x.date.getHours() === playerDate.getHours() 
                && x.date.getSeconds() === playerDate.getSeconds()
                && x.date.getMinutes() === playerDate.getMinutes()
            ))
            if (cited) {
                console.log(cited.url);
            }
        }
    }
}, 500)