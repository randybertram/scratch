# Get the prompt I want
autoload -Uz vcs_info
precmd_vcs_info() { vcs_info }
precmd_functions+=( precmd_vcs_info )
setopt prompt_subst
# RPROMPT=\$vcs_info_msg_0_
zstyle ':vcs_info:git:*' formats '%F{yellow}(%b)%r%f'
zstyle ':vcs_info:*' enable git
PROMPT='%F{yellow}$vcs_info_msg_0_%f %F{green}%~%f %# '

# Special commands I like
alias ic="ibmcloud"
alias kc="kubectl"
nd() {
	mkdir "$1"
	cd "$1"
}

alias ls="ls --color=auto"
