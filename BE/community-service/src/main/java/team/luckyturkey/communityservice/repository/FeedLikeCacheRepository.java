package team.luckyturkey.communityservice.repository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Repository
public class FeedLikeCacheRepository implements LikeCacheRepository{

    private final RedisTemplate<Long, Long> redisTemplate;
    private final ValueOperations<Long, Long> opsValue;

    public FeedLikeCacheRepository(@Qualifier("longRedisTemplate") RedisTemplate<Long, Long> redisTemplate) {
        // TODO: 로그 테이블을 읽고, redis에 삽입하는 연산이 필요합니다.

        log.info(redisTemplate.toString());
        this.redisTemplate = redisTemplate;
        this.opsValue = redisTemplate.opsForValue();
    }

    @Override
    public Long increaseLike(Long feedId) {
        return opsValue.increment(feedId);
    }

    @Override
    public Long decreaseLike(Long feedId) {
        return opsValue.decrement(feedId);
    }

    @Override
    public Long findByFeedId(Long feedId) {
        return opsValue.get(feedId);
    }

    @Override
    public Map<Long, Long> findBySourceIdList(List<Long> sourceIdList) {
        List<Long> likeList = opsValue.multiGet(sourceIdList);
        Map<Long, Long> result;
        int length = sourceIdList.size();

        if(likeList != null) {
            result = IntStream.range(0, length)
                    .boxed()
                    .collect(Collectors.toMap(sourceIdList::get, likeList::get));
        } else {
            result = new HashMap<>();
        }

        return result;
    }

    public void setLikeCountToZero(Long feedId) {
        if (feedId != null) {
            opsValue.setIfAbsent(feedId, 0L);
        }
    }
}