
package main
import "container/heap"

type NOT_FOUND struct {
    INTEGER_FORMAT int
    STRING_FORMAT  string
    ARRAY_FORMAT   []int
}

var VIDEO_NOT_FOUND = NOT_FOUND{
    INTEGER_FORMAT: -1,
    STRING_FORMAT:  "-1",
    ARRAY_FORMAT:   []int{-1},
}

type Video struct {
    content          string
    numberOfViews    int
    numberOfLikes    int
    numberOfDislikes int
}

func NewVideo(content string) *Video {
    return &Video{content: content}
}

type VideoSharingPlatform struct {
    availableVideoIDs         int
    videoIDsToVideos          map[int]*Video
    removedVideoIDsToBeReused PriorityQueue
}

func Constructor() VideoSharingPlatform {
    platform := VideoSharingPlatform{
        videoIDsToVideos:          map[int]*Video{},
        removedVideoIDsToBeReused: PriorityQueue{},
    }
    return platform
}

func (this *VideoSharingPlatform) Upload(videoContent string) int {
    var nextID int
    if this.removedVideoIDsToBeReused.Len() > 0 {
        nextID = heap.Pop(&this.removedVideoIDsToBeReused).(int)
    } else {
        nextID = this.availableVideoIDs
        this.availableVideoIDs++
    }

    this.videoIDsToVideos[nextID] = NewVideo(videoContent)
    return nextID
}

func (this *VideoSharingPlatform) Remove(videoID int) {
    if _, has := this.videoIDsToVideos[videoID]; has {
        delete(this.videoIDsToVideos, videoID)
        heap.Push(&this.removedVideoIDsToBeReused, videoID)
    }
}

func (this *VideoSharingPlatform) Watch(videoID int, startMinute int, endMinute int) string {
    if _, has := this.videoIDsToVideos[videoID]; !has {
        return VIDEO_NOT_FOUND.STRING_FORMAT
    }

    this.videoIDsToVideos[videoID].numberOfViews++
    endMinute = min(endMinute + 1, len(this.videoIDsToVideos[videoID].content))
    selectedContent := this.videoIDsToVideos[videoID].content[startMinute:endMinute]
    return selectedContent
}

func (this *VideoSharingPlatform) Like(videoID int) {
    if _, has := this.videoIDsToVideos[videoID]; has {
        this.videoIDsToVideos[videoID].numberOfLikes++
    }
}

func (this *VideoSharingPlatform) Dislike(videoID int) {
    if _, has := this.videoIDsToVideos[videoID]; has {
        this.videoIDsToVideos[videoID].numberOfDislikes++
    }
}

func (this *VideoSharingPlatform) GetLikesAndDislikes(videoID int) []int {
    if _, has := this.videoIDsToVideos[videoID]; !has {
        return VIDEO_NOT_FOUND.ARRAY_FORMAT
    }

    likes := this.videoIDsToVideos[videoID].numberOfLikes
    dislikes := this.videoIDsToVideos[videoID].numberOfDislikes
    return []int{likes, dislikes}
}

func (this *VideoSharingPlatform) GetViews(videoID int) int {
    if _, has := this.videoIDsToVideos[videoID]; !has {
        return VIDEO_NOT_FOUND.INTEGER_FORMAT
    }
    return this.videoIDsToVideos[videoID].numberOfViews
}

type PriorityQueue []int

func (pq PriorityQueue) Len() int {
    return len(pq)
}

func (pq PriorityQueue) Less(first int, second int) bool {
    return pq[first] < pq[second]
}

func (pq PriorityQueue) Swap(first int, second int) {
    pq[first], pq[second] = pq[second], pq[first]
}

func (pq *PriorityQueue) Push(object any) {
    *pq = append(*pq, object.(int))
}

func (pq *PriorityQueue) Pop() any {
    value := (*pq)[pq.Len() - 1]
    *pq = (*pq)[0 : pq.Len() - 1]
    return value
}
