package hello;

import java.util.concurrent.atomic.AtomicLong;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import java.util.List;

@RestController
public class ScoreController {

    private static final String template = "Hello, %s!";
    private final AtomicLong counter = new AtomicLong();


    private ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }



    @RequestMapping(value="/scores", method=RequestMethod.GET)
    public List<Score> getAllScores() {
        return scoreService.getAllScores();
    }


    @RequestMapping(value="/scores/add", method=RequestMethod.POST, consumes = "application/json")
    public Score addScore(@RequestBody Score score) {
        return scoreService.addScore(score);
    }

}