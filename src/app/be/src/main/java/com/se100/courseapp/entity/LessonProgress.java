package com.se100.courseapp.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_progress",
        uniqueConstraints = @UniqueConstraint(name = "uq_progress", columnNames = {"user_id", "lesson_id"}))
public class LessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private LessonStatus status = LessonStatus.LOCKED;

    @Column(name = "video_watched", nullable = false)
    private boolean videoWatched;

    @Column(name = "video_watched_at")
    private LocalDateTime videoWatchedAt;

    @Column(name = "quiz_passed", nullable = false)
    private boolean quizPassed;

    @Column(name = "best_score")
    private Integer bestScore;

    @Column(name = "unlocked_at")
    private LocalDateTime unlockedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public LessonProgress() { }

    public LessonProgress(User user, Lesson lesson, LessonStatus status) {
        this.user = user;
        this.lesson = lesson;
        this.status = status;
        if (status != LessonStatus.LOCKED) {
            this.unlockedAt = LocalDateTime.now();
        }
    }

    public boolean isLocked() { return status == LessonStatus.LOCKED; }

    public void unlock() {
        if (status == LessonStatus.LOCKED) {
            status = LessonStatus.UNLOCKED;
            unlockedAt = LocalDateTime.now();
        }
    }

    public void markVideoWatched() {
        if (!videoWatched) {
            videoWatched = true;
            videoWatchedAt = LocalDateTime.now();
        }
    }

    public void markCompleted() {
        quizPassed = true;
        if (status != LessonStatus.COMPLETED) {
            status = LessonStatus.COMPLETED;
            completedAt = LocalDateTime.now();
        }
    }

    public void recordScore(int score) {
        if (bestScore == null || score > bestScore) {
            bestScore = score;
        }
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Lesson getLesson() { return lesson; }
    public LessonStatus getStatus() { return status; }
    public void setStatus(LessonStatus status) { this.status = status; }
    public boolean isVideoWatched() { return videoWatched; }
    public LocalDateTime getVideoWatchedAt() { return videoWatchedAt; }
    public boolean isQuizPassed() { return quizPassed; }
    public Integer getBestScore() { return bestScore; }
    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
