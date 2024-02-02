package team.luckyturkey.memberservice.oauth2;

import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.stereotype.Component;

@Component
public class SocialClientRegistration {

    public ClientRegistration googleClientRegistration() {

        return ClientRegistration.withRegistrationId("google")
                .clientId("369405807431-pki0r440oh137ckh7lmotdof8sat2eot.apps.googleusercontent.com")
                .clientSecret("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")
                .redirectUri("http://localhost:8080/member/login/oauth2/code/google") //redirect url 수정해야함 //여기로 접근하면 구글로그인이 돼
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .scope("profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token") //토큰 발급 uri
                .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .issuerUri("https://accounts.google.com")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName(IdTokenClaimNames.SUB)
                .build();
    }

//    public ClientRegistration naverClientRegistration() {
//
//        return ClientRegistration.withRegistrationId("naver")
//                .clientId("아이디")
//                .clientSecret("비밀번호")
//                .redirectUri("http://localhost:8080/login/oauth2/code/naver")
//                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
//                .scope("name", "email")
//                .authorizationUri("https://nid.naver.com/oauth2.0/authorize")
//                .tokenUri("https://nid.naver.com/oauth2.0/token")
//                .userInfoUri("https://openapi.naver.com/v1/nid/me")
//                .userNameAttributeName("response")
//                .build();
//    }
}
