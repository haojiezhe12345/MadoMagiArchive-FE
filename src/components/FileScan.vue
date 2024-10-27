<template>
    <v-btn @click="connection.send('StartScan')">Start scan</v-btn>
    <v-btn @click="connection.send('StopScan')">Stop scan</v-btn>

    <div>Scanning: {{ scanning }}</div>
    <div>{{ currentFile }}</div>
    <div style="white-space: pre-wrap;">{{ error }}</div>
    <div>{{ message }}</div>
</template>

<script setup lang="ts">
import * as signalR from "@microsoft/signalr";

const scanning = ref<boolean>()
const currentFile = ref('')
const error = ref('')
const message = ref('')

const connection = new signalR.HubConnectionBuilder()
    .withUrl('api/files/scan')
    .withAutomaticReconnect()
    // .configureLogging(signalR.LogLevel.Trace)
    .build()

connection.on('IsScanning', (s: boolean) => scanning.value = s)

connection.on('ScanProgress', (added: number, total: number, file: string) => {
    console.log(added, total, file)
    currentFile.value = `${added} / ${total} - ${file}`
})

connection.on('Error', (msg: string) => {
    error.value = msg
})

connection.on('message', (msg: string) => {
    message.value = msg
})

onMounted(() => {
    connection.start()
})

onUnmounted(() => {
    connection.stop()
})
</script>
