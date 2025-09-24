
import kotlin.math.min

class VideoSharingPlatform() {

    private class VIDEO_NOT_FOUND {
        companion object {
            const val INTEGER_FORMAT = -1
            const val STRING_FORMAT = "-1"
            val ARRAY_FORMAT = intArrayOf(-1)
        }
    }

    private var availableVideoIDs = 0
    private val videoIDsToVideos = mutableMapOf<Int, Video>()
    private val removedVideoIDsToBeReused = java.util.PriorityQueue<Int>()

    fun upload(videoContent: String): Int {
        var nextID = 0
        if (!removedVideoIDsToBeReused.isEmpty()) {
            nextID = removedVideoIDsToBeReused.poll()
        } else {
            nextID = availableVideoIDs
            ++availableVideoIDs
        }

        videoIDsToVideos[nextID] = Video(videoContent)
        return nextID
    }

    fun remove(videoID: Int) {
        if (videoIDsToVideos.containsKey(videoID)) {
            videoIDsToVideos.remove(videoID)
            removedVideoIDsToBeReused.add(videoID)
        }
    }

    fun watch(videoID: Int, startMinute: Int, endMinute: Int): String {
        if (!videoIDsToVideos.containsKey(videoID)) {
            return VIDEO_NOT_FOUND.STRING_FORMAT
        }

        ++videoIDsToVideos[videoID]!!.numberOfViews
        var endMinute = min(endMinute + 1, videoIDsToVideos[videoID]!!.content.length)
        val selectedContent = videoIDsToVideos[videoID]!!.content.substring(startMinute, endMinute)
        return selectedContent
    }

    fun like(videoID: Int) {
        if (videoIDsToVideos.containsKey(videoID)) {
            ++videoIDsToVideos[videoID]!!.numberOfLikes
        }
    }

    fun dislike(videoID: Int) {
        if (videoIDsToVideos.containsKey(videoID)) {
            ++videoIDsToVideos[videoID]!!.numberOfDislikes
        }
    }

    fun getLikesAndDislikes(videoID: Int): IntArray {
        if (!videoIDsToVideos.containsKey(videoID)) {
            return VIDEO_NOT_FOUND.ARRAY_FORMAT
        }

        val likes = videoIDsToVideos[videoID]!!.numberOfLikes
        val dislikes = videoIDsToVideos[videoID]!!.numberOfDislikes
        return intArrayOf(likes, dislikes)
    }

    fun getViews(videoID: Int): Int {
        if (!videoIDsToVideos.containsKey(videoID)) {
            return VIDEO_NOT_FOUND.INTEGER_FORMAT
        }
        return videoIDsToVideos[videoID]!!.numberOfViews
    }
}

class Video(val content: String) {

    var numberOfViews = 0
    var numberOfLikes = 0
    var numberOfDislikes = 0
}
