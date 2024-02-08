package team.luckyturkey.communityservice.controller;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import team.luckyturkey.communityservice.client.MemberServiceClient;
import team.luckyturkey.communityservice.dto.MemberDto;
import team.luckyturkey.communityservice.dto.OriginDto;
import team.luckyturkey.communityservice.dto.response.FeedDetailResponse;
import team.luckyturkey.communityservice.entity.Feed;
import team.luckyturkey.communityservice.service.FeedService;
import team.luckyturkey.communityservice.service.LikeService;
import team.luckyturkey.communityservice.service.SubscribeService;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/feed")
public class FeedController {

    private final SubscribeService subscribeService;
    private final FeedService feedService;
    private final LikeService likeService;
    private final MemberServiceClient memberServiceClient;

    @GetMapping("/subscribe/{page}/{pageSize}")
    public List<FeedDetailResponse> getUserSubscribeFeedList(@PathVariable("page") int page,
                                                    @PathVariable("pageSize") int pageSize) {
        // TODO: Request Header jwt에서 memberId 받아 오기
        Long memberId = 5678L;
        List<Long> followingList = subscribeService.getFollowingList(memberId);
        List<Feed> feeds = feedService.getFeeds(followingList, page, pageSize);
        // TODO: Need DanceServiceClient Test
        return feedService.getFeedsAndDetail(feeds);
    }

    @GetMapping("/{page}/{pageSize}")
    public List<FeedDetailResponse> getUserFeedList(@PathVariable("page") int page,
                                                    @PathVariable("pageSize") int pageSize) {
        List<Feed> feeds = feedService.getAllFeeds(page, pageSize);
        for (Feed feed : feeds) {
            feed.setLikeCount(likeService.getFeedLikeCount(feed.getId()));
        }

        return feedService.getFeedsAndDetail(feeds);
    }

    @PostMapping("/")
    public void insertFeed(@RequestBody Feed feed) {
        // TODO: Request Header jwt에서 memberId 받아 오기
        Long memberId = 1234L;

        feed.setMemberId(memberId);
        feed.setLikeCount(0L);
        feed.setDownloadCount(0L);

        feedService.insertFeed(feed);
    }

    @GetMapping("/detail")
    public FeedDetailResponse getFeedDetail(@RequestParam("id") int intFeedId) {
        Long feedId = Long.valueOf(intFeedId);
        System.out.println(feedId);

        Feed feed = feedService.getFeedDetail(feedId);
        Long originId = feed.getOriginId();
        OriginDto originDto = feedService.getOriginDto(originId, feed.getFeedType());
        Long likeCount = likeService.getFeedLikeCount(feedId);
        MemberDto memberDto = memberServiceClient.getMemberInfo(feed.getMemberId());

        return FeedDetailResponse.builder()
                .feedId(feedId)
                .feedType(feed.getFeedType())
                .likeCount(likeCount)
                .downloadCount(feed.getDownloadCount())
                .feedDisable(feed.getFeedDisable())
                .originId(originId)
                .memberId(originDto.getMemberId())
                .feedName(originDto.getFeedName())
                .feedUrl(originDto.getFeedUrl())
                .feedDate(originDto.getFeedDate())
                .memberName(memberDto.getMemberName())
                .memberProfile(memberDto.getMemberProfile())
                .build();
    }

    @PostMapping("/disable")
    public void setFeedPublic(@RequestBody Feed feed) {
        feedService.setFeedPublic(feed, true);
    }

    @PatchMapping("/disable")
    public void setFeedPrivate(@RequestBody Feed feed) {
        feedService.setFeedPublic(feed, false);
    }
}
