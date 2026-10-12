package com.se100.courseapp.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "question_options")
public class QuestionOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    /** Vị trí của đáp án trong mảng options ở FE (0, 1, 2, 3). */
    @Column(name = "option_index", nullable = false)
    private Integer optionIndex;

    @Column(nullable = false, length = 500)
    private String content;

    @Column(name = "is_correct", nullable = false)
    private boolean correct;

    public Long getId() { return id; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public Integer getOptionIndex() { return optionIndex; }
    public void setOptionIndex(Integer optionIndex) { this.optionIndex = optionIndex; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }
}
