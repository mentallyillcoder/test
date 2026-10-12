package com.se100.courseapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext
class LearningFlowTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void coursesAreLoadedFromInitScript() throws Exception {
        mvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value("react-101"));
    }

    @Test
    void fullSequentialLearningFlow() throws Exception {
        // Lộ trình ban đầu: l1 mở, l2 khóa
        mvc.perform(get("/api/courses/react-101/lessons"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("UNLOCKED"))
                .andExpect(jsonPath("$[1].status").value("LOCKED"))
                .andExpect(jsonPath("$[0].questions[0].options.length()").value(4));

        // Bài đang khóa -> 403
        mvc.perform(post("/api/lessons/l2/watch-status")).andExpect(status().isForbidden());

        // Chưa xem video -> không được làm quiz
        mvc.perform(post("/api/lessons/l1/submit-quiz")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"answers\":{\"1\":0,\"2\":1}}"))
                .andExpect(status().isBadRequest());

        mvc.perform(post("/api/lessons/l1/watch-status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.videoWatched").value(true));

        // Sai 1/2 = 50% -> chưa đạt
        mvc.perform(post("/api/lessons/l1/submit-quiz")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"answers\":{\"1\":0,\"2\":0}}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.scorePercentage").value(50))
                .andExpect(jsonPath("$.isPassed").value(false));

        // Đúng 2/2 = 100% -> đạt, mở khóa l2
        mvc.perform(post("/api/lessons/l1/submit-quiz")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"answers\":{\"1\":0,\"2\":1}}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isPassed").value(true))
                .andExpect(jsonPath("$.nextLessonId").value("l2"));

        mvc.perform(get("/api/courses/react-101/lessons"))
                .andExpect(jsonPath("$[0].status").value("COMPLETED"))
                .andExpect(jsonPath("$[1].status").value("UNLOCKED"));

        // Reset -> quay về ban đầu
        mvc.perform(post("/api/courses/react-101/reset-progress"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("UNLOCKED"))
                .andExpect(jsonPath("$[0].videoWatched").value(false))
                .andExpect(jsonPath("$[1].status").value("LOCKED"));
    }
}
