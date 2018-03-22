package hello;

import javax.persistence.CascadeType;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

@Entity
@Getter
@Setter
public class Score {
    @Id
    @GeneratedValue
    long id;
    String name;
    int score;

}