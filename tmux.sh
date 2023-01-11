#!/bin/bash

session='habit-circles'

tmux new -d -s $session 'npm run watch'

tmux split-window -h 'npm run browser-sync:static'
#tmux split-window -h 'npm run browser-sync'

#tmux split-window -f

#tmux send-keys 'pm2 start pm2.config.cjs' C-m

tmux attach-session -t $session:0
