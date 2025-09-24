
/*
 PriorityQueue is internally included in the solution file on leetcode.
 When running the code on leetcode it should stay commented out. 
 It is mentioned here just for information about the external library 
 that is applied for this data structure.
 */

class VideoSharingPlatform {

    availableVideoIDs = 0;
    videoIDsToVideos = new Map<number, Video>();
    removedVideoIDsToBeReused = new PriorityQueue<number>((x, y) => x - y);

    upload(videoContent: string): number {
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

    remove(videoID: number): void {
        if (this.videoIDsToVideos.has(videoID)) {
            this.videoIDsToVideos.delete(videoID);
            this.removedVideoIDsToBeReused.enqueue(videoID);
        }
    }

    watch(videoID: number, startMinute: number, endMinute: number): string {
        if (!this.videoIDsToVideos.has(videoID)) {
            return VIDEO_NOT_FOUND.STRING_FORMAT;
        }

        ++this.videoIDsToVideos.get(videoID).numberOfViews;
        endMinute = Math.min(endMinute + 1, this.videoIDsToVideos.get(videoID).content.length);
        const selectedContent = this.videoIDsToVideos.get(videoID).content.substring(startMinute, endMinute);
        return selectedContent;
    }

    like(videoID: number): void {
        if (this.videoIDsToVideos.has(videoID)) {
            ++this.videoIDsToVideos.get(videoID).numberOfLikes;
        }
    }

    dislike(videoID: number): void {
        if (this.videoIDsToVideos.has(videoID)) {
            ++this.videoIDsToVideos.get(videoID).numberOfDislikes;
        }
    }

    getLikesAndDislikes(videoID: number): number[] {
        if (!this.videoIDsToVideos.has(videoID)) {
            return VIDEO_NOT_FOUND.ARRAY_FORMAT;
        }

        const likes = this.videoIDsToVideos.get(videoID).numberOfLikes;
        const dislikes = this.videoIDsToVideos.get(videoID).numberOfDislikes;
        return [likes, dislikes];
    }

    getViews(videoID: number): number {
        if (!this.videoIDsToVideos.has(videoID)) {
            return VIDEO_NOT_FOUND.INTEGER_FORMAT;
        }
        return this.videoIDsToVideos.get(videoID).numberOfViews;
    }

}

class Video {

    content: string = "";
    numberOfViews: number = 0;
    numberOfLikes: number = 0;
    numberOfDislikes: number = 0;

    constructor(content: string) {
        this.content = content;
    }
}

class VIDEO_NOT_FOUND {

    static INTEGER_FORMAT: number = -1;
    static STRING_FORMAT: string = "-1";
    static ARRAY_FORMAT: number[] = [-1];
}
