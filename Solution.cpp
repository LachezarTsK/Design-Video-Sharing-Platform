
#include <queue>
#include <string>
#include <vector>
#include <algorithm>
#include <unordered_map>
using namespace std;

class VideoSharingPlatform {

    struct VIDEO_NOT_FOUND {

        inline static const int INTEGER_FORMAT = -1;
        inline static const string STRING_FORMAT = "-1";
        inline static  const vector<int> ARRAY_FORMAT{ -1 };
    };

    struct Video {

        string content;
        int numberOfViews = 0;
        int numberOfLikes = 0;
        int numberOfDislikes = 0;

        Video() = default;
        Video(string content) : content{ content } {};
    };

    int availableVideoIDs = 0;
    unordered_map<int, Video> videoIDsToVideos;
    priority_queue<int, vector<int>, greater<int>> removedVideoIDsToBeReused;


public:
    int upload(string videoContent) {
        int nextID;
        if (!removedVideoIDsToBeReused.empty()) {
            nextID = removedVideoIDsToBeReused.top();
            removedVideoIDsToBeReused.pop();
        }
        else {
            nextID = availableVideoIDs;
            ++availableVideoIDs;
        }

        videoIDsToVideos[nextID] = Video(videoContent);
        return nextID;
    }

    void remove(int videoID) {
        if (videoIDsToVideos.contains(videoID)) {
            videoIDsToVideos.erase(videoID);
            removedVideoIDsToBeReused.push(videoID);
        }
    }

    string watch(int videoID, int startMinute, int endMinute) {
        if (!videoIDsToVideos.contains(videoID)) {
            return VIDEO_NOT_FOUND::STRING_FORMAT;
        }

        ++videoIDsToVideos[videoID].numberOfViews;
        endMinute = min(endMinute + 1, static_cast<int>(videoIDsToVideos[videoID].content.length()));
        string selectedContent = videoIDsToVideos[videoID].content.substr(startMinute, endMinute - startMinute);
        return selectedContent;
    }

    void like(int videoID) {
        if (videoIDsToVideos.contains(videoID)) {
            ++videoIDsToVideos[videoID].numberOfLikes;
        }
    }

    void dislike(int videoID) {
        if (videoIDsToVideos.contains(videoID)) {
            ++videoIDsToVideos[videoID].numberOfDislikes;
        }
    }

    vector<int> getLikesAndDislikes(int videoID) const {
        if (!videoIDsToVideos.contains(videoID)) {
            return VIDEO_NOT_FOUND::ARRAY_FORMAT;
        }

        int likes = videoIDsToVideos.at(videoID).numberOfLikes;
        int dislikes = videoIDsToVideos.at(videoID).numberOfDislikes;
        return  { likes, dislikes };
    }

    int getViews(int  videoID) const {
        if (!videoIDsToVideos.contains(videoID)) {
            return VIDEO_NOT_FOUND::INTEGER_FORMAT;
        }
        return videoIDsToVideos.at(videoID).numberOfViews;
    }
};
