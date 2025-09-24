
/*
 PriorityQueue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

class VideoSharingPlatform {

    availableVideoIDs = 0;
    // Map<number, Video>
    videoIDsToVideos = new Map();
    // PriorityQueue<number>
    removedVideoIDsToBeReused = new PriorityQueue((x, y) => x - y);

    /** 
     * @param {string} videoContent
     * @return {number}
     */
    upload(videoContent) {
        let nextID;
        if (!this.removedVideoIDsToBeReused.isEmpty()) {
            nextID = this.removedVideoIDsToBeReused.dequeue();
        } else {
            nextID = this.availableVideoIDs;
            ++this.availableVideoIDs;
        }

        this.videoIDsToVideos.set(nextID, new Video(videoContent));
        return nextID;
    }

    /** 
     * @param {number} videoID
     * @return {void}
     */
    remove(videoID) {
        if (this.videoIDsToVideos.has(videoID)) {
            this.videoIDsToVideos.delete(videoID);
            this.removedVideoIDsToBeReused.enqueue(videoID);
        }
    }

    /** 
     * @param {number} videoID
     * @param {number} startMinute 
     * @param {number} endMinute
     * @return {string}
     */
    watch(videoID, startMinute, endMinute) {
        if (!this.videoIDsToVideos.has(videoID)) {
            return VIDEO_NOT_FOUND.STRING_FORMAT;
        }

        ++this.videoIDsToVideos.get(videoID).numberOfViews;
        endMinute = Math.min(endMinute + 1, this.videoIDsToVideos.get(videoID).content.length);
        const selectedContent = this.videoIDsToVideos.get(videoID).content.substring(startMinute, endMinute);
        return selectedContent;
    }

    /** 
     * @param {number} videoID
     * @return {void}
     */
    like(videoID) {
        if (this.videoIDsToVideos.has(videoID)) {
            ++this.videoIDsToVideos.get(videoID).numberOfLikes;
        }
    }

    /** 
     * @param {number} videoID
     * @return {void}
     */
    dislike(videoID) {
        if (this.videoIDsToVideos.has(videoID)) {
            ++this.videoIDsToVideos.get(videoID).numberOfDislikes;
        }
    }

    /** 
     * @param {number} videoID
     * @return {number[]}
     */
    getLikesAndDislikes(videoID) {
        if (!this.videoIDsToVideos.has(videoID)) {
            return VIDEO_NOT_FOUND.ARRAY_FORMAT;
        }

        const likes = this.videoIDsToVideos.get(videoID).numberOfLikes;
        const dislikes = this.videoIDsToVideos.get(videoID).numberOfDislikes;
        return [likes, dislikes];
    }

    /** 
     * @param {number} videoID
     * @return {number}
     */
    getViews(videoID) {
        if (!this.videoIDsToVideos.has(videoID)) {
            return VIDEO_NOT_FOUND.INTEGER_FORMAT;
        }
        return this.videoIDsToVideos.get(videoID).numberOfViews;
    }

}

class Video {

    content = "";
    numberOfViews = 0;
    numberOfLikes = 0;
    numberOfDislikes = 0;

    /** 
     * @param {string} content
     */
    constructor(content) {
        this.content = content;
    }
}

class VIDEO_NOT_FOUND {

    static INTEGER_FORMAT = -1;
    static STRING_FORMAT = "-1";
    static ARRAY_FORMAT = [-1];
}
