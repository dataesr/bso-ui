#!/bin/bash
set -e

source .env.josm
PROJECT_DIR=$(pwd)
TARGET=$1

# start application
function start_application() {
    echo "Starting Application..."

    # Docker イメージのビルド（開発用）
    # docker build --target development -t "$IMAGE_NAME" "$PROJECT_DIR"

    # Docker イメージのビルド（本番用）
    docker build -t "$IMAGE_NAME" "$PROJECT_DIR"

    # 既存のコンテナを削除（同じ名前のコンテナが既に存在する場合）
    # docker stop "$CONTAINER_NAME" 2>/dev/null
    # docker rm "$CONTAINER_NAME" 2>/dev/null

    # コンテナの起動（ログをホスト側に出力）
    docker run -d --name "$CONTAINER_NAME" \
        --network "$NETWORK_NAME" \
        -p "$PORT:3000" \
        -v "$PROJECT_DIR:/app" \
        --log-driver=syslog \
        --log-opt syslog-address=udp://localhost:514 \
        --log-opt syslog-facility=local0 \
        --log-opt tag="bso-ui" \
        "$IMAGE_NAME"

    echo "Application started. Logs can be found in $LOG_FILE"
}

# stop application
# コンテナを停止
function stop_application() {
    echo "Stopping Application..."

    # コンテナが実行中か確認
    if docker ps -q -f name=$CONTAINER_NAME > /dev/null; then
        # コンテナが実行中の場合、停止、削除
        docker stop $CONTAINER_NAME
        docker rm -v $CONTAINER_NAME

        echo "Container $CONTAINER_NAME stopped."
    else
        echo "Container $CONTAINER_NAME is not running."
    fi
}

# rotate logs and upload logs to wasabi
function rotate_logs() {
    IFS=',' read -r -a LOG_DIRS <<< "$LOG_DIRS"
    for LOG_DIR in "${LOG_DIRS[@]}"; do
        # compress log files
        NOT_COMPRESSED_LOG_FILES=($(find "/var/log/${LOG_DIR}/" -name "*.log" -exec basename {} \; | sort))
        for LOG_FILE in "${NOT_COMPRESSED_LOG_FILES[@]}"; do
            LOG_DATE=$(basename "$LOG_FILE" | awk -F'_' '{print $1}')
            if [ $LOG_DATE -le $(date -d "1 days ago" "+%Y%m%d") ]; then
                gzip -k "/var/log/${LOG_DIR}/${LOG_FILE}"
                rm -f "/var/log/${LOG_DIR}/${LOG_FILE}"
            fi
        done

        # get sorted list of already uploaded logs
        ALREADY_UPLOADED_LOGS=($(aws s3 ls s3://${WASABI_BUCKET}/${S3_BUCKT_PREFIX_BACKUP_LOG}/${LOG_DIR}/ | grep -v 'PRE' | awk '{print $4}' | sort))
        pattern=$(printf "%s\n" "${ALREADY_UPLOADED_LOGS[@]}")

        # get sorted list of log files
        LOG_FILES=($(find "/var/log/${LOG_DIR}/" -name "*.log.gz" -exec basename {} \; | sort))

        # get list of not uploaded log files
        NOT_UPLOADED_LOG_FILES=($(printf "%s\n" "${LOG_FILES[@]}" | grep -Fxv -e "$pattern"))

        # upload log files
        for LOG_FILE in "${NOT_UPLOADED_LOG_FILES[@]}"; do
            LOG_DATE=$(basename "$LOG_FILE" | awk -F'_' '{print $1}')
            if [ $LOG_DATE -le $(date -d "$UPLOAD_LOG_DAYS days ago" "+%Y%m%d") ]; then
                aws s3 cp "/var/log/${LOG_DIR}/${LOG_FILE}" s3://${WASABI_BUCKET}/${S3_BUCKT_PREFIX_BACKUP_LOG}/${LOG_DIR}/
            fi
        done

        # delete old logs
        for LOG_FILE in "${LOG_FILES[@]}"; do
            LOG_DATE=$(basename "$LOG_FILE" | awk -F'_' '{print $1}')
            if [ $LOG_DATE -le $(date -d "$DELETE_LOG_DAYS days ago" "+%Y%m%d") ]; then
                rm -f "/var/log/${LOG_DIR}/${LOG_FILE}"
                echo "Deleted: ${LOG_DIR}/${LOG_FILE}"
            else
                break
            fi
        done
    done
}


# implement branching logic
if [ "$TARGET" = "startbsoui" ]; then
    echo "Selected: Start Application"
    start_application
elif [ "$TARGET" = "stopbsoui" ]; then
    echo "Selected: Stop Application"
    stop_application
elif [ "$TARGET" = "logrotationbsoui" ]; then
    echo "Selected: rotate logs and upload logs to wasabi"
    rotate_logs
else
    echo "Invalid target."
fi