
import java.util.HashMap;
import java.util.Map;
import java.util.PriorityQueue;

public class VideoSharingPlatform {

    private static class VIDEO_NOT_FOUND {

        static final int INTEGER_FORMAT = -1;
        static final String STRING_FORMAT = "-1";
        static final int[] ARRAY_FORMAT = {-1};
    }

    private int availableVideoIDs;
    private final Map<Integer, Video> videoIDsToVideos;
    private final PriorityQueue<Integer> removedVideoIDsToBeReused;

    public VideoSharingPlatform() {
        videoIDsToVideos = new HashMap<>();
        removedVideoIDsToBeReused = new PriorityQueue<>();
    }

    public int upload(String videoContent) {
        int nextID;
        if (!removedVideoIDsToBeReused.isEmpty()) {
            nextID = removedVideoIDsToBeReused.poll();
        } else {
            nextID = availableVideoIDs;
            ++availableVideoIDs;
        }

        videoIDsToVideos.put(nextID, new Video(videoContent));
        return nextID;
    }

    public void remove(int videoID) {
        if (videoIDsToVideos.containsKey(videoID)) {
            videoIDsToVideos.remove(videoID);
            removedVideoIDsToBeReused.add(videoID);
        }
    }

    public String watch(int videoID, int startMinute, int endMinute) {
        if (!videoIDsToVideos.containsKey(videoID)) {
            return VIDEO_NOT_FOUND.STRING_FORMAT;
        }

        ++videoIDsToVideos.get(videoID).numberOfViews;
        endMinute = Math.min(endMinute + 1, videoIDsToVideos.get(videoID).content.length());
        String selectedContent = videoIDsToVideos.get(videoID).content.substring(startMinute, endMinute);
        return selectedContent;
    }

    public void like(int videoID) {
        if (videoIDsToVideos.containsKey(videoID)) {
            ++videoIDsToVideos.get(videoID).numberOfLikes;
        }
    }

    public void dislike(int videoID) {
        if (videoIDsToVideos.containsKey(videoID)) {
            ++videoIDsToVideos.get(videoID).numberOfDislikes;
        }
    }

    public int[] getLikesAndDislikes(int videoID) {
        if (!videoIDsToVideos.containsKey(videoID)) {
            return VIDEO_NOT_FOUND.ARRAY_FORMAT;
        }

        int likes = videoIDsToVideos.get(videoID).numberOfLikes;
        int dislikes = videoIDsToVideos.get(videoID).numberOfDislikes;
        return new int[]{likes, dislikes};
    }

    public int getViews(int videoID) {
        if (!videoIDsToVideos.containsKey(videoID)) {
            return VIDEO_NOT_FOUND.INTEGER_FORMAT;
        }
        return videoIDsToVideos.get(videoID).numberOfViews;
    }
}

class Video {

    String content;
    int numberOfViews;
    int numberOfLikes;
    int numberOfDislikes;

    Video(String content) {
        this.content = content;
    }
}
