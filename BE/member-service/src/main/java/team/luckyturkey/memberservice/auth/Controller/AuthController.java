package team.luckyturkey.memberservice.auth.Controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import team.luckyturkey.memberservice.auth.jwt.JWTUtil;
import team.luckyturkey.memberservice.member.repository.RefreshTokenRepository;
import team.luckyturkey.memberservice.service.RefreshTokenService;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final RefreshTokenRepository tokenRepository;
    private final RefreshTokenService refreshTokenService;
    private final JWTUtil jwtUtil;

    @GetMapping("/tokentest")
    public ResponseEntity<?> test(@RequestHeader("Authorization") final String accessToken){
        if(jwtUtil.isExpired(accessToken)){
            return new ResponseEntity<>(HttpStatus.GATEWAY_TIMEOUT);
        }

        return  new ResponseEntity<>(HttpStatus.OK);
    }


//    @PostMapping("token/logout")
//    public ResponseEntity<StatusResponseDto> logout(@RequestHeader("Authorization") final String accessToken) {
//
//        // 엑세스 토큰으로 현재 Redis 정보 삭제
//        tokenService.removeRefreshToken(accessToken);
//        return ResponseEntity.ok(StatusResponseDto.addStatus(200));
//    }
//
//    @PostMapping("/token/refresh")
//    public ResponseEntity<?> refresh(@RequestHeader("Authorization") final String accessToken) {
//
//        // 액세스 토큰으로 Refresh 토큰 객체를 조회
//        Optional<> refreshToken = tokenRepository.findByAccessToken(accessToken);
//
//        // RefreshToken이 존재하고 유효하다면 실행
//        if (refreshToken.isPresent() && jwtUtil.verifyToken(refreshToken.get().getRefreshToken())) {
//            // RefreshToken 객체를 꺼내온다.
//            RefreshToken resultToken = refreshToken.get();
//            // 권한과 아이디를 추출해 새로운 액세스토큰을 만든다.
//            String newAccessToken = jwtUtil.generateAccessToken(resultToken.getId(), jwtUtil.getMemberRole(resultToken.getRefreshToken()));
//            // 액세스 토큰의 값을 수정해준다.
//            resultToken.updateAccessToken(newAccessToken);
//            tokenRepository.save(resultToken);
//            // 새로운 액세스 토큰을 반환해준다.
//            return ResponseEntity.ok(TokenResponseStatusDto.addStatus(200, newAccessToken));
//        }
//
//        return ResponseEntity.badRequest().body(TokenResponseStatusDto.addStatus(400, null));
//    }

}
