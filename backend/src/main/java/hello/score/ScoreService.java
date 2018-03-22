package hello;

import java.util.List;

import org.springframework.stereotype.Service;


@Service
public class ScoreService {
	
	private ScoreRepository scoreRepository;

	public ScoreService(ScoreRepository scoreRepository) {
		this.scoreRepository = scoreRepository;
	}

	Score addScore(Score score) {
		// here you can do some validations etc before saving the score
		
		return scoreRepository.save(score);
	}

	List<Score> getAllScores() {
		return scoreRepository.findAll();
	}

}