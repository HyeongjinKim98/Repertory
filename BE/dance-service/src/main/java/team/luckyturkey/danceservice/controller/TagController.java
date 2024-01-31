package team.luckyturkey.danceservice.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import team.luckyturkey.danceservice.controller.requestdto.PostTagRequest;
import team.luckyturkey.danceservice.controller.responsedto.StandardTagResponse;
import team.luckyturkey.danceservice.service.TagService;

import java.util.List;


@RestController
@RequestMapping("/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    /**
     * todo: get user id from jwt
     * */
    @Value("${test.environment.memberId}")
    private Long TEST_MEMBER_ID;

    @PostMapping
    public ResponseEntity<Long> postTag(
            @RequestBody PostTagRequest postTagRequest
    ){
        /**
         * todo: get user id from jwt
         * */
        Long tagId = tagService.saveTag(postTagRequest, TEST_MEMBER_ID);
        return ResponseEntity.ok(tagId);
    }

    @GetMapping
    public ResponseEntity<List<StandardTagResponse>> getTagList(

    ){
        /**
         * this is only for dummy
         * todo: get user id from jwt
         * */
        List<StandardTagResponse> tagList = tagService.getTagList(TEST_MEMBER_ID);
        return ResponseEntity.ok(tagList);
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<Long> deleteTag(
            @PathVariable Long tagId
    ){
        tagService.deleteTag(tagId);
        return ResponseEntity.ok(tagId);
    }

}