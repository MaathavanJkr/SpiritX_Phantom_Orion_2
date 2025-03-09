package models

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type Response struct {
	ID                string   `json:"id"`
	Object            string   `json:"object"`
	Created           int64    `json:"created"`
	Model             string   `json:"model"`
	Choices           []Choice `json:"choices"`
	Usage             Usage    `json:"usage"`
	ServiceTier       string   `json:"service_tier"`
	SystemFingerprint string   `json:"system_fingerprint"`
}

type Choice struct {
	Index        int     `json:"index"`
	Message      Message `json:"message"`
	LogProbs     any     `json:"logprobs"`
	FinishReason string  `json:"finish_reason"`
}

type Usage struct {
	PromptTokens            int          `json:"prompt_tokens"`
	CompletionTokens        int          `json:"completion_tokens"`
	TotalTokens             int          `json:"total_tokens"`
	PromptTokensDetails     TokenDetails `json:"prompt_tokens_details"`
	CompletionTokensDetails TokenDetails `json:"completion_tokens_details"`
}

type TokenDetails struct {
	CachedTokens             int `json:"cached_tokens"`
	AudioTokens              int `json:"audio_tokens"`
	AcceptedPredictionTokens int `json:"accepted_prediction_tokens,omitempty"`
	RejectedPredictionTokens int `json:"rejected_prediction_tokens,omitempty"`
	ReasoningTokens          int `json:"reasoning_tokens,omitempty"`
}
