from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from .models import Post
from .serializers import PostSerializer
from rest_framework.parsers import MultiPartParser, FormParser


# Simple view to list posts (GET) and create a post (POST).
# - GET: returns posts for the authenticated user, newest first
# - POST: accepts multipart/form-data for image uploads and saves the post
@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def posts_list_create(request):
    if request.method == 'GET':
        posts = Post.objects.filter(user=request.user).order_by('-created_at')
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    # POST -> create a new post, attach current user
    serializer = PostSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Delete a post by id. Only the owner can delete.
@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def post_delete(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    if post.user != request.user:
        return Response({"detail": "You can delete only your own posts."}, status=status.HTTP_403_FORBIDDEN)

    post.delete()
    return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)


# Toggle like/unlike for a post
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def like_toggle(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

    user = request.user
    if user in post.likes.all():
        post.likes.remove(user)
        return Response({"message": "Post unliked."}, status=status.HTTP_200_OK)

    post.likes.add(user)
    return Response({"message": "Post liked!"}, status=status.HTTP_200_OK)

        
