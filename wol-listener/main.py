import socket
import sys
from wakeonlan import send_magic_packet

def start_server(port=18889):
    server_socket = socket.socket()
    server_socket.bind(("192.168.2.146", port))
    server_socket.listen(5)
    print(f"Listening for WoL requests on port {port}", file=sys.stdout, flush=True)

    while True:
        client_socket, addr = server_socket.accept()
        print(f"Connection from {addr}", file=sys.stdout, flush=True)
        mac_address = client_socket.recv(1024).decode("utf-8").strip()
        if mac_address:
            print(f"Sending magic packet to {mac_address}", file=sys.stdout, flush=True)
            send_magic_packet(mac_address)
            client_socket.sendall(b"Magic packet sent successfully")
        client_socket.close()

start_server()
