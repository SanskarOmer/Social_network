from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Post
from .serializers import PostSerializer
from rest_framework.parsers import MultiPartParser, FormParser

# List & Create Posts
class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Allow file uploads using multipart/form-data
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        # show only posts by the logged-in user
        return Post.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


#  Delete Post
class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        post = self.get_object()
        if post.user != request.user:
            return Response({"detail": "You can delete only your own posts."},
                            status=status.HTTP_403_FORBIDDEN)
        post.delete()
        return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)


# Like / Unlike (toggle)
class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if user in post.likes.all():
            post.likes.remove(user)
            return Response({"message": "Post unliked."}, status=status.HTTP_200_OK)
        else:
            post.likes.add(user)
            return Response({"message": "Post liked!"}, status=status.HTTP_200_OK)
        
        
