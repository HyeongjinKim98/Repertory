package team.luckyturkey.danceservice.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Component;

@Component
@Getter @Setter
public class TokenService {
    private String token;
}
