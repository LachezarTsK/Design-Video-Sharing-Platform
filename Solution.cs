
using System;
using System.Collections.Generic;

public class VideoSharingPlatform
{
    private static class VIDEO_NOT_FOUND
    {
        public static readonly int INTEGER_FORMAT = -1;
        public static readonly string STRING_FORMAT = "-1";
        public static readonly int[] ARRAY_FORMAT = { -1 };
    }

    private int availableVideoIDs;
    private readonly Dictionary<int, Video> videoIDsToVideos = [];
    private readonly PriorityQueue<int, int> removedVideoIDsToBeReused = new();

    public int Upload(string videoContent)
    {
        int nextID;
        if (removedVideoIDsToBeReused.Count > 0)
        {
            nextID = removedVideoIDsToBeReused.Dequeue();
        }
        else
        {
            nextID = availableVideoIDs;
            ++availableVideoIDs;
        }

        videoIDsToVideos.Add(nextID, new Video(videoContent));
        return nextID;
    }

    public void Remove(int videoID)
    {
        if (videoIDsToVideos.ContainsKey(videoID))
        {
            videoIDsToVideos.Remove(videoID);
            removedVideoIDsToBeReused.Enqueue(videoID, videoID);
        }
    }

    public string Watch(int videoID, int startMinute, int endMinute)
    {
        if (!videoIDsToVideos.ContainsKey(videoID))
        {
            return VIDEO_NOT_FOUND.STRING_FORMAT;
        }

        ++videoIDsToVideos[videoID].numberOfViews;
        endMinute = Math.Min(endMinute + 1, videoIDsToVideos[videoID].content.Length);
        string selectedContent = videoIDsToVideos[videoID].content.Substring(startMinute, endMinute - startMinute);
        return selectedContent;
    }

    public void Like(int videoID)
    {
        if (videoIDsToVideos.ContainsKey(videoID))
        {
            ++videoIDsToVideos[videoID].numberOfLikes;
        }
    }

    public void Dislike(int videoID)
    {
        if (videoIDsToVideos.ContainsKey(videoID))
        {
            ++videoIDsToVideos[videoID].numberOfDislikes;
        }
    }

    public int[] GetLikesAndDislikes(int videoID)
    {
        if (!videoIDsToVideos.ContainsKey(videoID))
        {
            return VIDEO_NOT_FOUND.ARRAY_FORMAT;
        }

        int likes = videoIDsToVideos[videoID].numberOfLikes;
        int dislikes = videoIDsToVideos[videoID].numberOfDislikes;
        return [likes, dislikes];
    }

    public int GetViews(int videoID)
    {
        if (!videoIDsToVideos.ContainsKey(videoID))
        {
            return VIDEO_NOT_FOUND.INTEGER_FORMAT;
        }
        return videoIDsToVideos[videoID].numberOfViews;
    }
}

class Video(string content)
{
    public string content = content;
    public int numberOfViews;
    public int numberOfLikes;
    public int numberOfDislikes;
}
